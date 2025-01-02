import React, { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-hot-toast";
import { io } from "socket.io-client";
import "./Home.css";
import { FaBars, FaTimes } from "react-icons/fa";
import Chat_list from "./Chat_list";
import Show_available_users from "./Show_available_users";
import Logo from "./Logo";
import ChatWindow from "./ChatWindow";
import { Link, useNavigate } from "react-router-dom";

const Home = () => {
  const navigate = useNavigate();
  const [socket, setSocket] = useState(null);
  const [availableUsers, setAvailableUsers] = useState([]);
  const [searchUsers, setSearchUsers] = useState("");
  const [currentChatUser, setCurrentChatUser] = useState("");
  const [loadingMessage, setLoadingMessage] = useState(false);
  const [isLoadingSearch, setIsLoadingSearch] = useState(false);

  const [sender, setSender] = useState("");
  const [chatList, setChatList] = useState([]);
  const [isSidebarVisible, setSidebarVisible] = useState(false);

  const toggleSidebar = () => {
    setSidebarVisible(!isSidebarVisible);
  };

  // current loggin user state
  const [name, setName] = useState(localStorage.getItem("mingle-name") || "");
  const [email, setEmail] = useState(
    localStorage.getItem("mingle-email") || ""
  );

  useEffect(() => {
    // Establish socket connection once when the component mounts
    const socketConnection = io("wss://mingle-chat-app.onrender.com");

    // Set the socket connection to the state
    setSocket(socketConnection);

    socketConnection.on("connect", () => {
      console.log("Connected to socket server");
    });

    // Cleanup on unmount
    return () => {
      socketConnection.disconnect();
      console.log("Socket disconnected");
    };
  }, []);

  // Fetch the sender ID from localStorage
  useEffect(() => {
    const senderId = localStorage.getItem("mingle-sender-id");
    if (senderId) {
      setSender(senderId);
    }
  }, []);

  // Fetch chat list from the server
  const getChatList = async () => {
    if (!sender) return; // Avoid API call if sender is not set
    try {
      const { data } = await axios.post(
        "https://mingle-chat-app.onrender.com/api/get-present-chats",
        { sender }
      );
      if (data.success) {
        setChatList(data.chats);
      } else {
        toast.error("No chats found");
      }
    } catch (error) {
      console.log(error);
      toast.error(error?.response?.data?.message || "Failed to fetch chats");
    }
  };

  // Trigger fetching the chat list when sender changes
  useEffect(() => {
    getChatList();
  }, [sender]);

  // verify token

  const verifyToken = async () => {
    const token = localStorage.getItem("mingle-token");
    const tokenExpiry = localStorage.getItem("mingle-token-expiry");
    const loggenInUser = localStorage.getItem("mingle-sender-id");

    if (!token || !tokenExpiry) {
      alert("login to continue.");
      navigate("/login");
      return;
    }
    // Check if the token is expired
    if (new Date().getTime() > tokenExpiry) {
      // Token expired

      localStorage.clear();
      alert("Session expired. Please log in again.");
      navigate("/login");
    } else {
      navigate(`/${loggenInUser}`);
    }
  };

  // search available users
  const searchAvailableUsers = async () => {
    setIsLoadingSearch(true);
    try {
      const response = await axios.post(
        "https://mingle-chat-app.onrender.com/api/search-users",
        { searchUsers }
      );
      setAvailableUsers(
        response.data.users.filter((users) => users.email != email) || []
      );
      // console.log(response.data.users);
    } catch (error) {
      console.error("Error while searching users:", error);
      toast.error("Failed to search users.");
    } finally {
      setIsLoadingSearch(false);
    }
  };

  // render the correct component based on search query
  const renderSidebarContent = () => {
    if (isLoadingSearch) return <div>Loading...</div>;

    if (searchUsers.trim() === "") {
      return (
        <Chat_list
          sender={sender}
          chatList={chatList}
          openChatWindow_default={openChatWindow_default}
        />
      );
    } else {
      return (
        <Show_available_users
          availableUsers={availableUsers}
          openChatWindow_searched={openChatWindow_searched}
        />
      );
    }
  };

  // open-chat-window searched

  const openChatWindow_searched = async (_id) => {
    if (!_id) {
      toast.error("User ID is required.");
      return;
    }
    console.log("currentchatuser id", _id);

    try {
      setLoadingMessage(true);
      const response = await axios.post(
        "https://mingle-chat-app.onrender.com/api/open-chat-window-searched",
        { _id }
      );
      setCurrentChatUser(response.data.user);
      // console.log(response.data);
      toast.success("Chat opened successfully!");
    } catch (error) {
      console.error("Error opening chat window:", error);
      toast.error("Failed to open chat window.");
    } finally {
      setLoadingMessage(false);
    }
  };

  // open chat window default
  const openChatWindow_default = async (_id) => {
    if (!_id) {
      toast.error("User ID is required.");
      return;
    }
    console.log("currentchatuser id", _id);

    try {
      setLoadingMessage(true);
      const response = await axios.post(
        "https://mingle-chat-app.onrender.com/api/open-chat-window-default",
        { _id }
      );
      setCurrentChatUser(
        response.data.user.participants.find((user) => user.name != name)
      );
      // console.log(
      //   response.data.user.participants.find((user) => user.name != name)
      // );
      toast.success("Chat opened successfully!");
    } catch (error) {
      console.error("Error opening chat window:", error);
      toast.error("Failed to open chat window.");
    } finally {
      setLoadingMessage(false);
    }
  };

  const logOut = () => {
    // socket.disconnect();
    localStorage.clear();
    setAvailableUsers([]);
    setCurrentChatUser("");
    setSearchUsers("");
    setTimeout(() => {
      navigate("/login");
    }, 1000);
  };

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchUsers.trim()) {
        searchAvailableUsers(); // Trigger search only after delay
      } else {
        setAvailableUsers([]);
        getChatList();
      }
    }, 500);

    return () => clearTimeout(timeoutId); // Clear timeout if searchUsers changes
  }, [searchUsers]);

  useEffect(() => {
    verifyToken();
  }, []);
  return (
    <>
      <div className="chat-application-container">
        {/* Sidebar */}
        <div
          className={`sidebar-container ${isSidebarVisible ? "visible" : ""}`}
        >
          <div className="icon-container">
            <div className="hamburger" onClick={toggleSidebar}>
              <FaBars />
            </div>
            <div className="self-info">
              <span>{name.split(" ")[0]} </span>
              <Link onClick={logOut} className="logout-link">
                Logout
              </Link>
            </div>
          </div>

          <div className="search-bar-container">
            <input
              type="text"
              placeholder="Enter name"
              value={searchUsers}
              onChange={(e) => setSearchUsers(e.target.value)}
            />
            <button
              onClick={() => {
                setSearchUsers("");
                setAvailableUsers([]);
              }}
            >
              <FaTimes />
            </button>
          </div>

          <div className="chat-list-container">{renderSidebarContent()}</div>
        </div>

        {/* Chat area */}
        <div className="chat-area-container">
          {/* Conditional rendering based on users search */}
          <div className="chat-area">
            {currentChatUser ? (
              <ChatWindow currentChatUser={currentChatUser} socket={socket} />
            ) : (
              <Logo />
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Home;
