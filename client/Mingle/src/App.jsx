import React from "react";
import { Route, Routes } from "react-router-dom";
import Signup from "./components/authPages/Signup";
import Login from "./components/authPages/Login";
import { Toaster } from "react-hot-toast";
import Home from "./components/Pages/Home";
import Show_available_users from "./components/Pages/Show_available_users";
import Chat_content from "./components/Pages/Chat_content";

const App = () => {
  return (
    <div>
      <Toaster position="top-right" reverseOrder={false} />

      {/* Routes for different pages */}
      <Routes>
        <Route path="/:id" element={<Home />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/chat-content" element={<Chat_content />} />
        <Route
          path="/show-available-users"
          element={<Show_available_users />}
        />
      </Routes>
    </div>
  );
};

export default App;
