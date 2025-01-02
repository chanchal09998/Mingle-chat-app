import userModel from "../models/UserModels.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
dotenv.config();

export const Signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    // Check if the user already exists
    const existingUser = await userModel.findOne({ email });
    if (existingUser) {
      return res
        .status(400)
        .json({ message: "User already exists, please login" });
    }

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create new user object
    const newUser = new userModel({
      name,
      email,
      password: hashedPassword,
    });

    // Save new user to the database
    await newUser.save();

    res.status(201).json({
      message: "User created successfully",
      newUser,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};

export const Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Check if the user exists
    const user = await userModel.findOne({ email });
    if (!user) {
      return res
        .status(404)
        .json({ message: "User does not exist, please signup" });
    }

    // Compare provided password with stored password
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: "Invalid credentials" });
    }

    // Generate JWT token with user information
    const token = jwt.sign(
      { id: user._id, email: user.email },
      process.env.JWT_SECURITY_KEY
    );

    res.status(200).json({
      message: "Login successful",
      token,
      user,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Server error, please try again later" });
  }
};
