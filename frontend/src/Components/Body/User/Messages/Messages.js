import React, { useState, useEffect } from "react";
import { useSearchParams, useNavigate } from "react-router-dom";
import {
  getAllConversationsHandler,
  getConversationHandler,
  sendMessageHandler,
  markAsReadHandler,
  getUserInfoHandler,
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
    hasPrevPage: false,
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
        setMessages((prevMessages) => [...prevMessages, response.data]);
      }
    } catch (error) {
      setError("Error sending message");
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
        await markAsReadHandler({ messageIds }, setIsLoading, setError);

        setMessages((prevMessages) =>
          prevMessages.map((message) =>
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
    const fetchData = async () => {
      try {
        setIsLoading(true);
        const response = await getAllConversationsHandler(
          { page: 1, limit: pagination.limit },
          setIsLoading,
          setError
        );

        if (response && response.success) {
          //console.log("Conversations fetched:", response.data.conversations);
          setConversations(response.data.conversations);
          setPagination(response.data.pagination);

          // Get userId from URL params or query params
          const userId = parseInt(
            searchParams.get("userId") ||
              window.location.pathname.split("/").pop(),
            10
          );
          //console.log("URL userId (converted to number):", userId);

          if (userId) {
            // Find the user in the conversations
            const conversation = response.data.conversations.find(
              (conv) => conv.user.id === userId
            );

            //console.log("Found conversation:", conversation);

            if (conversation) {
              //console.log("Setting selected user:", conversation.user);
              // Set the selected user
              setSelectedUser(conversation.user);
              // Fetch messages for this user
              //console.log("Fetching messages for user:", conversation.user.id);
              const messages = await fetchMessages(conversation.user.id);
              if (messages) {
                //console.log("Messages fetched:", messages);
                markMessagesAsRead(messages, conversation.user.id);
              }
            } else {
              // If no conversation exists, fetch user info
              try {
                const userInfoResponse = await getUserInfoHandler(
                  { userId },
                  setIsLoading,
                  setError
                );

                if (userInfoResponse && userInfoResponse.success) {
                  const userData = userInfoResponse.data;
                  const newUser = {
                    id: userId,
                    name: userData.name,
                    UserProfile: userData.UserProfile?.profileUrl,
                  };

                  setSelectedUser(newUser);
                  setMessages([]);
                } else {
                  setError("Could not fetch user information");
                }
              } catch (error) {
                console.error("Error fetching user info:", error);
                setError("Error fetching user information");
              }
            }
          }
        }
      } catch (error) {
        console.error("Error in fetchData:", error);
        setError("Error fetching conversations");
      } finally {
        setIsLoading(false);
      }
    };

    fetchData();
  }, []);

  // Add a useEffect to watch for conversations changes
  useEffect(() => {
    const userId = parseInt(searchParams.get("userId"), 10);
    //console.log("Watching conversations change. Current userId:", userId);
    //console.log("Current conversations:", conversations);

    if (userId && conversations.length > 0) {
      const conversation = conversations.find(
        (conv) => conv.user.id === userId
      );

      //console.log("Found conversation in watch effect:", conversation);

      if (conversation && (!selectedUser || selectedUser.id !== userId)) {
        
        setSelectedUser(conversation.user);
        fetchMessages(conversation.user.id).then((messages) => {
          if (messages) {
            markMessagesAsRead(messages, conversation.user.id);
          }
        });
      }
    }
  }, [conversations, searchParams]);

  if (isLoading) {
    return <div className="messages-loading">Loading...</div>;
  }

  if (error) {
    return <div className="messages-error">{error}</div>;
  }
  //console.log(selectedUser);
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
                    {conversation.lastMessage.message}
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

              <div className="messages-list">
                {messages.map((message) => (
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
                ))}
              </div>

              <div className="message-input">
                <input
                  type="text"
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  placeholder="Type a message..."
                  onKeyPress={(e) => e.key === "Enter" && handleSendMessage()}
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
