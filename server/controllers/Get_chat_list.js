import chatModel from "../models/chatModel.js";

export const getPresentChats = async (req, res) => {
  const { sender } = req.body; // The user whose chats we are fetching
  try {
    // Fetch chats where the sender is a participant
    const chats = await chatModel
      .find({
        participants: { $in: [sender] }, // Check if 'sender' is part of 'participants'
      })
      .populate("participants", "name email") // Optional: populate user details
      .populate("latestMessage"); // Optional: include the latest message

    res.status(200).json({
      success: true,
      chats,
    });
  } catch (error) {
    console.error("Error fetching chats:", error);
    res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
};
