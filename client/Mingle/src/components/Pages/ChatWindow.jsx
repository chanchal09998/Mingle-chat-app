import React, { useEffect, useState } from "react";
import { FiUser } from "react-icons/fi";
import Chat_content from "./Chat_content";
import "./ChatWindow.css";
import toast from "react-hot-toast";
import axios from "axios";

const ChatWindow = ({ currentChatUser, socket }) => {
  console.log("ChatWindow rendered with user:", currentChatUser);

  const [loadingMessage, setLoadingMessage] = useState(false);
  const [sendMessage, setSendMessage] = useState("");
  const [messages, setMessages] = useState([]);
  const [receiver, setReceiver] = useState("");
  const [sender, setSender] = useState("");

  // Emit user connection to update userSocketMap
  useEffect(() => {
    if (socket) {
      const storedSender = localStorage.getItem("mingle-sender-id");
      if (storedSender) {
        setSender(storedSender);
        socket.emit("user-connected", storedSender); // Notify the backend about the connection
        console.log("User connected:", storedSender);
      }

      // Listen for new messages
      socket.on("new-message", (message) => {
        console.log("Received new message from socket:", message);
        setMessages((prevMessages) => [...prevMessages, message]);
      });
    }

    return () => {
      if (socket) {
        socket.off("new-message");
        console.log("Socket disconnected");
      }
    };
  }, [socket]);

  // Update receiver whenever the current chat user changes
  useEffect(() => {
    if (currentChatUser?._id) {
      setReceiver(currentChatUser._id);
    }
  }, [currentChatUser]);

  // Set sender from localStorage
  useEffect(() => {
    const storedSender = localStorage.getItem("mingle-sender-id");
    if (storedSender) {
      setSender(storedSender);
    }
  }, []);

  // Fetch messages between sender and receiver
  const getMessagesFunc = async () => {
    console.log("Fetching messages for:", { sender, receiver });
    try {
      const { data } = await axios.post(
        "https://mingle-chat-app.onrender.com/api/get-messages",
        { sender, receiver }
      );
      if (data.success) {
        setMessages(data.messages);
        console.log(data.messages); // Update messages array
      }
    } catch (error) {
      console.error(error);
      toast.error(error?.response?.data?.message || "Failed to fetch messages");
    }
  };

  // Fetch messages when both sender and receiver are set
  useEffect(() => {
    if (sender && receiver) {
      getMessagesFunc();
    }
  }, [sender, receiver]);

  useEffect(() => {
    if (currentChatUser?._id) {
      setReceiver(currentChatUser._id);

      // Join the room for the current chat
      const roomId = [sender, currentChatUser._id].sort().join("-");
      socket.emit("join-room", { sender, receiver: currentChatUser._id });
      console.log(`Joined room: ${roomId}`);
    }
  }, [currentChatUser, sender, socket]);

  // socket send message function

  const sendMessageSocket = (message, sender, receiver) => {
    const messageData = {
      sender,
      receiver,
      message,
      createdAt: new Date().toISOString(), // Adding the createdAt timestamp on the frontend
    };

    // Emit the message to the socket server
    socket.emit("send-message", messageData);

    // Update the sender's message list immediately
    setMessages((prevMessages) => [
      ...prevMessages,
      messageData, // No need to add createdAt again here, it's already included
    ]);
    setSendMessage("");

    console.log("Sending message to socket:", messageData);
  };

  // Send a message
  // const sendMessageFunc = async () => {
  //   if (!sendMessage.trim()) {
  //     toast.error("Message cannot be empty");
  //     return;
  //   }

  //   setLoadingMessage(true);
  //   try {
  //     const { data } = await axios.post(
  //       "http://localhost:3000/api/send-message",
  //       {
  //         sender,
  //         receiver,
  //         message: sendMessage,
  //       }
  //     );

  //     if (data.success) {
  //       toast.success("Message sent");
  //       setMessages((prev) => [...prev, data.message]); // Append the new message
  //       setSendMessage(""); // Clear the input field
  //       sendMessageSocket(sendMessage, sender, receiver);
  //     }
  //   } catch (error) {
  //     console.error(error);
  //     toast.error(error?.response?.data?.message || "Failed to send message");
  //   } finally {
  //     setLoadingMessage(false);
  //   }
  // };

  // If no user is selected
  if (!currentChatUser) {
    return (
      <div className="chat-window-placeholder">
        <p>Please select a user to start chatting.</p>
      </div>
    );
  }

  return (
    <div className="chat-window">
      {/* User Information */}
      <div className="user-info">
        <div className="user-avatar">
          {currentChatUser[0]?.image ? (
            <img src={currentChatUser.image} alt="User Avatar" />
          ) : (
            <FiUser />
          )}
        </div>
        <p className="user-name">{currentChatUser.name || "Unknown User"}</p>
      </div>

      {/* Chat Messages */}
      <div className="messages-container">
        {messages.length > 0 ? (
          <Chat_content
            messages={messages}
            currentUserId={sender}
            receiver={currentChatUser.name}
          />
        ) : (
          <p className="no-messages-placeholder">
            No messages yet. Start the conversation!
          </p>
        )}
      </div>

      {/* Send Message Section */}
      <div className="send-message-container">
        <input
          type="text"
          className="message-input"
          placeholder="Type your message..."
          value={sendMessage}
          onChange={(e) => setSendMessage(e.target.value)}
        />
        <button
          className="send-button"
          onClick={() => sendMessageSocket(sendMessage, sender, receiver)}
          disabled={loadingMessage}
        >
          {loadingMessage ? "Sending..." : "Send"}
        </button>
      </div>
    </div>
  );
};

export default ChatWindow;
