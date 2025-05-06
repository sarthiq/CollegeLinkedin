import React, { useState, useEffect, useRef } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  // Socket event handlers
  useEffect(() => {
    const handleNewMessage = (message) => {
      // If we're in the conversation with either sender or receiver
      if (selectedUser && (message.senderId === selectedUser.id || message.receiverId === selectedUser.id)) {
        setMessages(prevMessages => [...prevMessages, message]);
        // Only mark as read if we're the receiver
        if (message.senderId === selectedUser.id) {
          markMessagesAsRead([message], selectedUser.id);
        }
        // Scroll to bottom when new message arrives
        setTimeout(scrollToBottom, 100);
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

    // Subscribe to socket events
    socketService.on('new_message', handleNewMessage);
    socketService.on('new_message_notification', handleNewMessageNotification);
    socketService.on('user_joined_room', handleUserJoinedRoom);
    socketService.on('user_left_room', handleUserLeftRoom);

    return () => {
      // Cleanup socket listeners
      socketService.off('new_message', handleNewMessage);
      socketService.off('new_message_notification', handleNewMessageNotification);
      socketService.off('user_joined_room', handleUserJoinedRoom);
      socketService.off('user_left_room', handleUserLeftRoom);
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
        setTimeout(scrollToBottom, 100);
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
        // Add the message to the current conversation immediately
        const sentMessage = response.data;
        setMessages(prevMessages => [...prevMessages, sentMessage]);
        
        // Update conversation list with the new message
        setConversations(prevConversations => {
          const updatedConversations = prevConversations.map(conv => {
            if (conv.user.id === selectedUser.id) {
              return {
                ...conv,
                lastMessage: sentMessage
              };
            }
            return conv;
          });
          return updatedConversations;
        });

        setNewMessage("");
        // Scroll to bottom after sending
        setTimeout(scrollToBottom, 100);
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
        await markAsReadHandler({ messageIds }, () => {}, setError);

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

  // Initial load - fetch conversations and check URL for selected user
  useEffect(() => {
    fetchConversations();
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
        <div className="conversations-list">
          <h2>Conversations</h2>
          {conversations.length === 0 ? (
            <div className="no-conversations">No conversations yet</div>
          ) : (
            conversations.map((conversation) => (
              <div
                key={conversation.user.id}
                className={`conversation-item ${
                  selectedUser?.id === conversation.user.id ? "selected" : ""
                }`}
                onClick={() => handleUserSelect(conversation.user)}
              >
                <img
                  src={
                    conversation.user.UserProfile?.profileUrl
                      ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${conversation.user.UserProfile.profileUrl}`
                      : "/assets/Utils/male.png"
                  }
                  alt={conversation.user.name}
                  className="user-avatar"
                />
                <div className="conversation-info">
                  <h3>{conversation.user.name}</h3>
                  <p className="last-message">
                    {conversation.lastMessage.message.length > 30
                      ? `${conversation.lastMessage.message.substring(0, 30)}...`
                      : conversation.lastMessage.message}
                  </p>
                  {conversation.unreadCount > 0 && (
                    <span className="unread-count">
                      {conversation.unreadCount}
                    </span>
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        <div className="messages-view">
          {selectedUser ? (
            <>
              <div className="messages-header">
                <img
                  src={
                    selectedUser.UserProfile?.profileUrl
                      ? `${process.env.REACT_APP_REMOTE_ADDRESS}/${selectedUser.UserProfile.profileUrl}`
                      : "/assets/Utils/male.png"
                  }
                  alt={selectedUser.name}
                  className="user-avatar"
                />
                <h2>{selectedUser.name}</h2>
              </div>

              <div 
                className="messages-list"
                ref={messagesContainerRef}
              >
                {isMessagesLoading ? (
                  <div className="messages-loading-indicator">Loading messages...</div>
                ) : (
                  messages.map((message) => (
                    <div
                      key={message.id}
                      className={`message ${
                        message.senderId === selectedUser.id ? "received" : "sent"
                      }`}
                    >
                      <div className="message-content">
                        <p>{message.message}</p>
                        <span className="message-time">
                          {new Date(message.createdAt).toLocaleTimeString()}
                          {message.senderId !== selectedUser.id &&
                            (message.isRead ? " ✓✓" : " ✓")}
                        </span>
                      </div>
                    </div>
                  ))
                )}
                <div ref={messagesEndRef} />
              </div>

              <div className="message-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
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
            <div className="no-selection">
              <p>Select a conversation to start messaging</p>
            </div>
          )}
        </div>
      </div>
      <div className="messages-side-spacing"></div>
    </div>
  );
};
