import React, { useEffect, useState } from "react";
import "./Chat_list.css";
import { FiUser } from "react-icons/fi";
import toast from "react-hot-toast";
import axios from "axios";

const Chat_list = ({ openChatWindow_default, chatList, sender }) => {
  return (
    <>
      {chatList.length > 0 ? (
        chatList.map((chat) => (
          <div
            className="chat"
            key={chat._id}
            onClick={() => openChatWindow_default(chat._id)}
          >
            <div className="img-container">
              <FiUser />
            </div>
            <div className="name-and-message">
              {chat.participants.filter(
                (participant) => participant._id !== sender
              )[0]?.name || "Unknown User"}
              <br />
              {chat.latestMessage?.message || "No messages yet"}
            </div>
            <div className="time">
              {new Date(chat.updatedAt).toLocaleTimeString([], {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </div>
          </div>
        ))
      ) : (
        <p>No chats available</p>
      )}
    </>
  );
};

export default Chat_list;
