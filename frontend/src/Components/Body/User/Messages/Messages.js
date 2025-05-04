import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import { 
  getAllConversationsHandler, 
  getConversationHandler, 
  sendMessageHandler,
  markAsReadHandler 
} from "./messagesApiHandler";
import "./Messages.css";

export const Messages = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [conversations, setConversations] = useState([]);
  const [selectedUser, setSelectedUser] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");
  const [pagination, setPagination] = useState({
    page: 1,
    limit: 10,
    total: 0,
    totalPages: 0,
    hasNextPage: false,
    hasPrevPage: false
  });

  const fetchConversations = async (page = 1) => {
    try {
      setIsLoading(true);
      const response = await getAllConversationsHandler(
        { page, limit: pagination.limit },
        setIsLoading,
        setError
      );
      if (response && response.success) {
        setConversations(response.data.conversations);
        setPagination(response.data.pagination);

        // After fetching conversations, check if we need to select a user from URL
        const userId = searchParams.get("userId");
        if (userId && !selectedUser) {
          const user = response.data.conversations.find(conv => conv.user.id === userId);
          if (user) {
            handleUserSelect(user.user);
          }
        }
      }
    } catch (error) {
      setError("Error fetching conversations");
    } finally {
      setIsLoading(false);
    }
  };

  const fetchMessages = async (userId, page = 1) => {
    try {
      setIsLoading(true);
      const response = await getConversationHandler(
        { userId, page, limit: 20 },
        setIsLoading,
        setError
      );
      if (response && response.success) {
        const reversedMessages = [...response.data.messages].reverse();
        setMessages(reversedMessages);
        setPagination(response.data.pagination);
        return reversedMessages;
      }
    } catch (error) {
      setError("Error fetching messages");
    } finally {
      setIsLoading(false);
    }
    return null;
  };

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !selectedUser) return;
    
    try {
      const response = await sendMessageHandler(
        { receiverId: selectedUser.id, message: newMessage },
        setIsLoading,
        setError
      );
      if (response && response.success) {
        setNewMessage("");
        setMessages(prevMessages => [...prevMessages, response.data]);
      }
    } catch (error) {
      setError("Error sending message");
    }
  };

  const markMessagesAsRead = async (messages, userId) => {
    if (!messages || !userId) return;
    
    const unreadMessages = messages.filter(
      message => !message.isRead && message.senderId === userId
    );
    
    if (unreadMessages.length > 0) {
      try {
        const messageIds = unreadMessages.map(message => message.id);
        await markAsReadHandler(
          { messageIds },
          setIsLoading,
          setError
        );
        
        setMessages(prevMessages => 
          prevMessages.map(message => 
            messageIds.includes(message.id) 
              ? { ...message, isRead: true }
              : message
          )
        );
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

  // Handle URL changes
  useEffect(() => {
    const userId = searchParams.get("userId");
    if (userId && conversations.length > 0 && (!selectedUser || selectedUser.id !== userId)) {
      const user = conversations.find(conv => conv.user.id === userId);
      if (user) {
        handleUserSelect(user.user);
      }
    }
  }, [searchParams, conversations]);

  if (isLoading) {
    return <div className="messages-loading">Loading...</div>;
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
                className={`conversation-item ${selectedUser?.id === conversation.user.id ? 'selected' : ''}`}
                onClick={() => handleUserSelect(conversation.user)}
              >
                <img 
                  src={process.env.REACT_APP_REMOTE_ADDRESS +'/'+ conversation.user.UserProfile?.profileUrl || "/assets/Utils/male.png"} 
                  alt={conversation.user.name}
                  className="user-avatar"
                />
                <div className="conversation-info">
                  <h3>{conversation.user.name}</h3>
                  <p className="last-message">{conversation.lastMessage.message}</p>
                  {conversation.unreadCount > 0 && (
                    <span className="unread-count">{conversation.unreadCount}</span>
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
                  src={process.env.REACT_APP_REMOTE_ADDRESS +'/'+ selectedUser.UserProfile?.profileUrl || "/assets/Utils/male.png"} 
                  alt={selectedUser.name}
                  className="user-avatar"
                />
                <h2>{selectedUser.name}</h2>
              </div>
              
              <div className="messages-list">
                {messages.map((message) => (
                  <div
                    key={message.id}
                    className={`message ${message.senderId === selectedUser.id ? 'received' : 'sent'}`}
                  >
                    <div className="message-content">
                      <p>{message.message}</p>
                      <span className="message-time">
                        {new Date(message.createdAt).toLocaleTimeString()}
                        {message.senderId !== selectedUser.id && (
                          message.isRead ? ' ✓✓' : ' ✓'
                        )}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="message-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === 'Enter' && handleSendMessage()}
                />
                <button onClick={handleSendMessage}>Send</button>
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
