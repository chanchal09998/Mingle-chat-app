import userModel from "../models/UserModels.js";

export const openChatWindowSearched = async (req, res) => {
  try {
    const { _id } = req.body;

    // Find the user
    const user = await userModel.findById(_id);

    res.status(200).json({
      success: true,
      message: "Chat window data retrieved successfully.",
      user, // Provide user data to the frontend
    });
  } catch (error) {
    console.error("Error in openChatWindow:", error);

    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving the chat window data.",
      error: error.message, // Provide the error message for debugging
    });
  }
};
