import React from "react";
import "./Show_available_users.css";
import { FiUser } from "react-icons/fi";
import axios from "axios";

const Show_available_users = ({ availableUsers, openChatWindow_searched }) => {
  return (
    <>
      {availableUsers && availableUsers.length > 0 ? (
        availableUsers.map((user) => (
          <div
            key={user._id}
            className="chat"
            onClick={() => openChatWindow_searched(user._id)}
          >
            <div className="img-container">
              <FiUser />
            </div>
            <div className="name-and-message">{user.name}</div>
          </div>
        ))
      ) : (
        <div className="no-users">No users available</div>
      )}
    </>
  );
};

export default Show_available_users;
