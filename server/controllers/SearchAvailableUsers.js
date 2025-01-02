import userModel from "../models/UserModels.js";

export const searchAvailableUsers = async (req, res) => {
  const { searchUsers } = req.body;

  try {
    // Validate input
    if (!searchUsers || typeof searchUsers !== "string") {
      return res.status(400).json({
        success: false,
        message: "Invalid input. 'searchUsers' must be a non-empty string.",
      });
    }

    // Search users based on the input
    const users = await userModel.find({
      name: { $regex: searchUsers, $options: "i" }, // Case-insensitive regex search
    });

    // Return the result
    res.status(200).json({
      success: true,
      users,
    });
  } catch (error) {
    console.error("Error while searching users:", error);

    // Send error response
    res.status(500).json({
      success: false,
      message:
        "An error occurred while searching for users. Please try again later.",
    });
  }
};
