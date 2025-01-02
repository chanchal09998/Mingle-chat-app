import React from "react";
import "./Chat_content.css";

const Chat_content = ({ messages, currentUserId, receiver }) => {
  return (
    <div className="chat-content-container">
      {messages && messages.length > 0 ? (
        messages.map((message, index) => {
          const isSender = message.sender === currentUserId;
          return (
            <div
              key={index}
              className={`chat-content ${isSender ? "sent" : "received"}`}
            >
              <div className="name-and-message">
                <strong>{isSender ? "You" : receiver}</strong>
                <br />
                {message.message}
              </div>
              <div className="time">
                {new Date(
                  message.createdAt || message.timestamp
                ).toLocaleTimeString([], {
                  hour: "2-digit",
                  minute: "2-digit",
                })}
              </div>
            </div>
          );
        })
      ) : (
        <p className="no-messages-placeholder">
          No messages yet. Start the conversation!
        </p>
      )}
    </div>
  );
};

export default Chat_content;
