import messageModel from "../models/messageModel.js";

export const getMessages = async (req, res) => {
  try {
    const { sender, receiver } = req.body;

    // Find messages between sender and receiver
    const messages = await messageModel
      .find({
        $or: [
          { sender, receiver }, // Case 1: Sender sent to Receiver
          { sender: receiver, receiver: sender }, // Case 2: Receiver sent to Sender
        ],
      })
      .sort({ createdAt: 1 }); // Sort messages by timestamp (ascending)

    // Send response
    res.status(200).json({
      success: true,
      messages,
    });
  } catch (error) {
    console.error("Error fetching messages:", error);

    // Send error response
    res.status(500).json({
      success: false,
      message: "Server error from get messages",
      error: error.message,
    });
  }
};
