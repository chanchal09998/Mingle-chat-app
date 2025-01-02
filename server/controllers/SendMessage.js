import chatModel from "../models/chatModel.js";
import messageModel from "../models/messageModel.js";

export const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;

    if (!sender || !receiver || !message) {
      return res.status(400).json({
        success: false,
        message: "Sender, receiver, and message are required.",
      });
    }

    // Create and save the message
    const newMessage = new messageModel({
      sender,
      receiver,
      message,
    });

    await newMessage.save();

    // Check if a chat between these participants already exists
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

    res
      .status(201)
      .json({ success: true, message: "Message recorded successfully" });
  } catch (error) {
    console.error("Error in sendMessage:", error.message, error);
    res.status(500).json({
      success: false,
      message: "Server error from send message",
    });
  }
};
