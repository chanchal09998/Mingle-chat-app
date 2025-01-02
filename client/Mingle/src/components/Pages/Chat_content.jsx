import React, { useEffect, useRef } from "react";
import "./Chat_content.css";

const Chat_content = ({ messages, currentUserId, receiver }) => {
  const bottomRef = useRef(null); // Create a reference to the bottom of the chat

  // Scroll to the bottom whenever the messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]); // Trigger when the messages change

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

      {/* Add an empty div that will be targeted by the scroll */}
      <div ref={bottomRef}></div>
    </div>
  );
};

export default Chat_content;
