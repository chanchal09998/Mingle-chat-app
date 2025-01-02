import express from "express";
import {
  loginValidation,
  signupValidation,
} from "../middlewares/AuthMiddlewares.js";
import { Login, Signup } from "../controllers/authControllers.js";
import { sendMessage } from "../controllers/SendMessage.js";
import { searchAvailableUsers } from "../controllers/SearchAvailableUsers.js";
import { getPresentChats } from "../controllers/Get_chat_list.js";
import { openChatWindowDefault } from "../controllers/openChatWindowDefault.js";
import { getMessages } from "../controllers/getMessages.js";
import { openChatWindowSearched } from "../controllers/OpenChatWindowSerched.js";
const router = express.Router();

// auth routes************
router.post("/signup", signupValidation, Signup);
router.post("/login", loginValidation, Login);

// search available users
router.post("/search-users", searchAvailableUsers);

// get-present-chats routes***********
router.post("/get-present-chats", getPresentChats);

// search current chat id and open the chat window
router.post("/open-chat-window-searched", openChatWindowSearched);
router.post("/open-chat-window-default", openChatWindowDefault);

// sentmessage routes*************
// router.post("/send-message", sendMessage);

// getMessages Routes************
router.post("/get-messages", getMessages);

export default router;
