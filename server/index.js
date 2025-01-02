import express from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import cors from "cors";
import router from "./routes/Routes.js";
import { Server } from "socket.io";
import messageModel from "./models/messageModel.js";
import chatModel from "./models/chatModel.js";

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;

// Middleware to parse JSON payloads
app.use(express.json());
app.use(cors());
app.use("/api", router);

// MongoDB connection using Mongoose
mongoose
  .connect(process.env.MONGO_URL)
  .then(() => {
    console.log("✅ MongoDB connected successfully");
  })
  .catch((error) => {
    console.error("❌ Error connecting to MongoDB:", error);
    process.exit(1); // Exit process with failure
  });

// Base route
app.get("/", (req, res) => {
  res.send("Welcome to my chat app");
});

// Handle undefined routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// Start server
const server = app.listen(port, () => {
  console.log(`🚀 Server running on http://localhost:${port}`);
});

const io = new Server(server, {
  cors: {
    origin: "*", // Your frontend URL (replace with actual)
    methods: ["GET", "POST"],
    allowedHeaders: ["Content-Type"],
  },
});
// Handle Socket.IO connections

// const userSocketMap = {};
io.on("connection", (socket) => {
  console.log("A user connected:", socket.id);

  // // Handle user connection
  // socket.on("user-connected", (userId) => {
  //   userSocketMap[userId] = socket.id; // Map user ID to socket ID
  //   socket.userId = userId; // Attach userId to the socket object
  //   console.log("User map updated:", userSocketMap);
  // });

  // Join a room for the one-to-one chat
  socket.on("join-room", ({ sender, receiver }) => {
    const roomId = [sender, receiver].sort().join("-"); // Create a unique room ID
    socket.join(roomId); // Join the room
    console.log(`User ${sender} joined room: ${roomId}`);
  });

  // Listen for messages from clients
  socket.on("send-message", async ({ message, sender, receiver, createAt }) => {
    console.log(`Message from ${sender} to ${receiver}: ${message}`);

    const newMessage = new messageModel({
      sender,
      receiver,
      message,
      createAt,
    });

    await newMessage.save();
    let chat = await chatModel.findOne({
      $and: [
        { participants: { $in: [sender] } }, // Check if sender is in participants
        { participants: { $in: [receiver] } }, // Check if receiver is in participants
      ],
    });

    if (chat) {
      // Update the latest message in the existing chat
      chat.latestMessage = newMessage._id; // Use the message ID
      await chat.save();
    } else {
      // Create a new chat
      chat = new chatModel({
        participants: [sender, receiver], // Store as an array of IDs
        latestMessage: newMessage._id, // Use the message ID
      });

      await chat.save();
    }

    // Check if receiver is connected
    // const receiverSocketId = userSocketMap[receiver];
    // if (receiverSocketId) {
    //   io.to(receiverSocketId).emit("new-message", newMessage);
    //   console.log(`Message sent to ${receiver}:`, newMessage);
    // } else {
    //   console.log(`Receiver ${receiver} not connected.`);
    // }

    const roomId = [sender, receiver].sort().join("-");
    socket.broadcast.to(roomId).emit("new-message", newMessage); // Broadcast to the room
    console.log(`Message sent to room ${roomId}:`, newMessage);
  });

  // Handle disconnections
  socket.on("disconnect", () => {
    // const userId = socket.userId; // Access the userId stored on the socket
    // if (userId) {
    //   delete userSocketMap[userId]; // Remove user from the map
    //   console.log(`User ${userId} disconnected and removed from map.`);
    // }
    console.log("A user disconnected:", socket.id);
  });
});
