import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate, useParams } from "react-router-dom";
import {
  getAllConversationsHandler,
  getConversationHandler,
  sendMessageHandler,
  markAsReadHandler,
  getUserInfoHandler,
} from "./messagesApiHandler";
import { socketService } from "../../../../services/socketService";
import "./Messages.css";

export const Messages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const { userId: routeUserId } = useParams();
  const [isInitialLoading, setIsInitialLoading] = useState(true);
  const [isMessagesLoading, setIsMessagesLoading] = useState(false);
  const [isSendingMessage, setIsSendingMessage] = useState(false);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const messagesEndRef = useRef(null);
  const messagesContainerRef = useRef(null);
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false,
  });
  const [onlineUsers, setOnlineUsers] = useState(new Set());
  const [typingUsers, setTypingUsers] = useState(new Set());
  const typingTimeoutRef = useRef(null);
  const typingStatusMap = useRef(new Map());

  const scrollToBottom = () => {
    if (messagesContainerRef.current) {
      messagesContainerRef.current.scrollTo({
        top: messagesContainerRef.current.scrollHeight,
        behavior: "smooth"
      });
    }
  };

  // Socket event handlers
  useEffect(() => {
    // Notify server that we're entering messages page
    socketService.emit('enter_messages_page');

    const handleNewMessage = (message) => {
      // If we're in the conversation with either sender or receiver
      if (selectedUser && (message.senderId === selectedUser.id || message.receiverId === selectedUser.id)) {
        setMessages(prevMessages => [...prevMessages, message]);
        // Only mark as read if we're the receiver
        if (message.senderId === selectedUser.id) {
          markMessagesAsRead([message], selectedUser.id);
        }
        // Scroll to bottom when new message arrives
        requestAnimationFrame(() => {
          scrollToBottom();
        });
      } else {
        // If we're in messages section but not in this conversation, update conversation list
        setConversations(prevConversations => {
          const updatedConversations = prevConversations.map(conv => {
            if (conv.user.id === message.senderId || conv.user.id === message.receiverId) {
              return {
                ...conv,
                lastMessage: message,
                unreadCount: message.senderId === conv.user.id ? (conv.unreadCount || 0) + 1 : conv.unreadCount
              };
            }
            return conv;
          });
          return updatedConversations;
        });
      }
    };

    const handleNewMessageNotification = (data) => {
      console.log("New message notification received in Messages:", data);
      // Only update if we're not in the conversation with this sender
      if (!selectedUser || selectedUser.id !== data.message.sender.id) {
        setConversations(prevConversations => {
          const updatedConversations = prevConversations.map(conv => {
            if (conv.user.id === data.message.sender.id) {
              return {
                ...conv,
                lastMessage: data.message,
                unreadCount: (conv.unreadCount || 0) + 1
              };
            }
            return conv;
          });
          return updatedConversations;
        });
      }
    };

    const handleUserJoinedRoom = ({ roomId, userId }) => {
      if (selectedUser && userId === selectedUser.id) {
        // User is typing or online status can be handled here
      }
    };

    const handleUserLeftRoom = ({ roomId, userId }) => {
      if (selectedUser && userId === selectedUser.id) {
        // User is offline or stopped typing can be handled here
      }
    };

    const handleUserStatusChange = (data) => {
      console.log("User status change:", data);
      setOnlineUsers(prev => {
        const newSet = new Set(prev);
        if (data.status === 'online') {
          newSet.add(data.userId);
        } else {
          newSet.delete(data.userId);
        }
        return newSet;
      });

      // Update conversation list with new status
      setConversations(prevConversations => {
        return prevConversations.map(conv => {
          if (conv.user.id === data.userId) {
            return {
              ...conv,
              user: {
                ...conv.user,
                isOnline: data.status === 'online'
              }
            };
          }
          return conv;
        });
      });
    };

    const handleMessagesRead = (data) => {
      console.log("Messages read:", data);
      if (selectedUser && data.userId === selectedUser.id) {
        setMessages(prevMessages => {
          return prevMessages.map(message => {
            if (data.messageIds.includes(message.id)) {
              return { ...message, isRead: true };
            }
            return message;
          });
        });
      }
    };

    const handleTypingStatus = (data) => {
      console.log("Typing status:", data);
      
      // Handle both single user typing status and multiple users typing status
      if (data.typingUsers) {
        // Multiple users typing status update
        data.typingUsers.forEach(typingUserId => {
          typingStatusMap.current.set(typingUserId, true);
        });
      } else {
        // Single user typing status update
        if (data.isTyping) {
          typingStatusMap.current.set(data.userId, true);
        } else {
          typingStatusMap.current.delete(data.userId);
        }
      }

      // Update typing users set for the chat view
      setTypingUsers(prev => {
        const newSet = new Set(prev);
        if (data.typingUsers) {
          data.typingUsers.forEach(userId => newSet.add(userId));
        } else {
          if (data.isTyping) {
            newSet.add(data.userId);
          } else {
            newSet.delete(data.userId);
          }
        }
        return newSet;
      });

      // Update conversation list with typing status
      setConversations(prevConversations => {
        return prevConversations.map(conv => {
          if (data.typingUsers) {
            return {
              ...conv,
              isTyping: data.typingUsers.includes(conv.user.id)
            };
          } else if (conv.user.id === data.userId) {
            return {
              ...conv,
              isTyping: data.isTyping
            };
          }
          return conv;
        });
      });
    };

    // Subscribe to socket events
    socketService.on('new_message', handleNewMessage);
    socketService.on('new_message_notification', handleNewMessageNotification);
    socketService.on('user_joined_room', handleUserJoinedRoom);
    socketService.on('user_left_room', handleUserLeftRoom);
    socketService.on('user_status_change', handleUserStatusChange);
    socketService.on('messages_read', handleMessagesRead);
    socketService.on('typing_status', handleTypingStatus);

    return () => {
      // Notify server that we're leaving messages page
      socketService.emit('leave_messages_page');
      
      // Cleanup socket listeners
      socketService.off('new_message', handleNewMessage);
      socketService.off('new_message_notification', handleNewMessageNotification);
      socketService.off('user_joined_room', handleUserJoinedRoom);
      socketService.off('user_left_room', handleUserLeftRoom);
      socketService.off('user_status_change', handleUserStatusChange);
      socketService.off('messages_read', handleMessagesRead);
      socketService.off('typing_status', handleTypingStatus);
    };
  }, [selectedUser]);

  // Join/leave room when selected user changes
  useEffect(() => {
    if (selectedUser) {
      socketService.joinRoom(selectedUser.id);
    }
    return () => {
      if (selectedUser) {
        socketService.leaveRoom(selectedUser.id);
      }
    };
  }, [selectedUser]);

  const fetchConversations = async (page = 1) => {
    try {
      setIsInitialLoading(true);
      const response = await getAllConversationsHandler(
        { page, limit: pagination.limit },
        () => {},
        setError
      );
      if (response && response.success) {
        setConversations(response.data.conversations);
        setPagination(response.data.pagination);

        const userId = searchParams.get("userId");
        if (userId && !selectedUser) {
          const user = response.data.conversations.find(
            (conv) => conv.user.id === userId
          );
          if (user) {
            handleUserSelect(user.user);
          }
        }
      }
    } catch (error) {
      setError("Error fetching conversations");
    } finally {
      setIsInitialLoading(false);
    }
  };

  const fetchMessages = async (userId, page = 1) => {
    try {
      setIsMessagesLoading(true);
      const response = await getConversationHandler(
        { userId, page, limit: 20 },
        () => {},
        setError
      );
      if (response && response.success) {
        const reversedMessages = [...response.data.messages].reverse();
        setMessages(reversedMessages);
        setPagination(response.data.pagination);
        // Scroll to bottom after messages load
        requestAnimationFrame(() => {
          scrollToBottom();
        });
        return reversedMessages;
      }
    } catch (error) {
      setError("Error fetching messages");
    } finally {
      setIsMessagesLoading(false);
    }
    return null;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;

    try {
      setIsSendingMessage(true);
      const response = await sendMessageHandler(
        { receiverId: selectedUser.id, message: newMessage },
        () => {},
        setError
      );
      if (response && response.success) {
        setNewMessage("");
        // Scroll to bottom after sending
        requestAnimationFrame(() => {
          scrollToBottom();
        });
      }
    } catch (error) {
      setError("Error sending message");
    } finally {
      setIsSendingMessage(false);
    }
  };

  const markMessagesAsRead = async (messages, userId) => {
    if (!messages || !userId) return;

    const unreadMessages = messages.filter(
      (message) => !message.isRead && message.senderId === userId
    );

    if (unreadMessages.length > 0) {
      try {
        const messageIds = unreadMessages.map((message) => message.id);
        await markAsReadHandler({ messageIds, senderId: userId }, () => {}, setError);

        // Emit socket event for message read status
        socketService.emitMessageRead(messageIds, userId);

        setMessages((prevMessages) =>
          prevMessages.map((message) =>
            messageIds.includes(message.id)
              ? { ...message, isRead: true }
              : message
          )
        );

        // Update unread count in conversations
        setConversations(prevConversations => {
          return prevConversations.map(conv => {
            if (conv.user.id === userId) {
              return {
                ...conv,
                unreadCount: Math.max(0, conv.unreadCount - unreadMessages.length)
              };
            }
            return conv;
          });
        });
      } catch (error) {
        console.error("Error marking messages as read:", error);
      }
    }
  };

  const handleUserSelect = async (user) => {
    if (!user) return;

    setSelectedUser(user);
    setSearchParams({ userId: user.id });
    const messages = await fetchMessages(user.id);
    if (messages) {
      markMessagesAsRead(messages, user.id);
    }
  };

  const handleBackClick = () => {
    setSelectedUser(null);
    setSearchParams({});
  };

  // Add new function to fetch user info
  const fetchUserInfo = async (userId) => {
    try {
      const response = await getUserInfoHandler(
        { userId },
        () => {},
        setError
      );
      if (response && response.success) {
        return response.data;
      }
    } catch (error) {
      setError("Error fetching user info");
      return null;
    }
  };

  // Handle route parameter separately from conversations
  useEffect(() => {
    const initializeConversation = async () => {
      if (routeUserId && !selectedUser) {
        const userInfo = await fetchUserInfo(routeUserId);
        if (userInfo) {
          handleUserSelect(userInfo);
        }
      }
    };

    initializeConversation();
  }, [routeUserId]); // Only depend on routeUserId

  // Initial load - fetch conversations
  useEffect(() => {
    fetchConversations();
  }, []);

  // Handle typing status
  const handleTyping = () => {
    if (!selectedUser) return;

    // Clear existing timeout
    if (typingTimeoutRef.current) {
      clearTimeout(typingTimeoutRef.current);
    }

    // Emit typing started
    socketService.emitTypingStatus(selectedUser.id, true);

    // Set timeout to stop typing status
    typingTimeoutRef.current = setTimeout(() => {
      socketService.emitTypingStatus(selectedUser.id, false);
    }, 2000);
  };

  // Cleanup typing timeout on unmount
  useEffect(() => {
    return () => {
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current);
      }
    };
  }, []);

  if (isInitialLoading) {
    return <div className="messages-loading">Loading conversations...</div>;
  }

  if (error) {
    return <div className="messages-error">{error}</div>;
  }

  return (
    <div className="messages-container">
      <div className="messages-side-spacing"></div>
      <div className="messages-content">
        <div className="messages-conversations-list">
          <h2>Conversations</h2>
          {conversations.length === 0 ? (
            <div className="messages-no-conversations">No conversations yet</div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.user.id}
                className={`messages-conversation-item ${
                  selectedUser?.id === conversation.user.id ? "selected" : ""
                }`}
                onClick={() => handleUserSelect(conversation.user)}
              >
                <div className="messages-avatar-container">
                  <img
                    src={
                      conversation.user.UserProfile?.profileUrl
                        ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${conversation.user.UserProfile.profileUrl}`
                        : "/assets/Utils/male.png"
                    }
                    alt={conversation.user.name}
                    className="messages-user-avatar"
                  />
                  {conversation.user.isOnline && (
                    <span className="messages-online-indicator"></span>
                  )}
                </div>
                <div className="messages-conversation-info">
                  <div className="messages-user-info">
                    <h3>{conversation.user.name}</h3>
                    {conversation.user.isOnline && (
                      <div className="messages-online-status">
                        <span className="messages-online-dot"></span>
                        <span className="messages-online-text">Online</span>
                      </div>
                    )}
                  </div>
                  <p className="messages-last-message">
                    {typingStatusMap.current.has(conversation.user.id) ? (
                      <span className="messages-typing-indicator">typing...</span>
                    ) : (
                      conversation.lastMessage.message.length > 30
                        ? `${conversation.lastMessage.message.substring(0, 30)}...`
                        : conversation.lastMessage.message
                    )}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <span className="messages-unread-count">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className={`messages-chat-view ${selectedUser ? 'active' : ''}`}>
          {selectedUser ? (
            <>
              <div className="messages-chat-header">
                <button 
                  className="messages-mobile-back-button"
                  onClick={handleBackClick}
                  aria-label="Back to conversations"
                >
                  ←
                </button>
                <img
                  src={
                    selectedUser.UserProfile?.profileUrl
                      ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${selectedUser.UserProfile.profileUrl}`
                      : "/assets/Utils/male.png"
                  }
                  alt={selectedUser.name}
                  className="messages-user-avatar"
                />
                <div className="messages-chat-header-info">
                  <h2>{selectedUser.name}</h2>
                  {typingStatusMap.current.has(selectedUser.id) && (
                    <span className="messages-typing-indicator">typing...</span>
                  )}
                </div>
              </div>

              <div 
                className="messages-chat-list"
                ref={messagesContainerRef}
              >
                {isMessagesLoading ? (
                  <div className="messages-loading-indicator">Loading messages...</div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`messages-chat-message ${
                        message.senderId === selectedUser.id ? "received" : "sent"
                      }`}
                    >
                      <div className="messages-chat-message-content">
                        <p>{message.message}</p>
                        <span className="messages-chat-message-time">
                          {new Date(message.createdAt).toLocaleTimeString()}
                          {message.senderId !== selectedUser.id &&
                            (message.isRead ? " ✓✓" : " ✓")}
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>

              <div className="messages-chat-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => {
                    setNewMessage(e.target.value);
                    handleTyping();
                  }}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
                  disabled={isSendingMessage}
                />
                <button 
                  onClick={handleSendMessage}
                  disabled={isSendingMessage}
                >
                  {isSendingMessage ? "Sending..." : "Send"}
                </button>
              </div>
            </>
          ) : (
            <div className="messages-no-selection">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
      <div className="messages-side-spacing"></div>
    </div>
  );
};
