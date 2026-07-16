import User from "../models/user.model.js";
import bcrypt from "bcryptjs";
import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/util.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// ================= SIGNUP =================
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !email || !password) {
      return res.status(400).json({ message: "All fields are required" });
    }

    if (password.length < 6) {
      return res.status(400).json({
        message: "Password must be at least 6 characters",
      });
    }

    // Check email uniqueness
    const emailExists = await User.findOne({ email });
    if (emailExists) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Check username uniqueness
    const usernameExists = await User.findOne({ username });
    if (usernameExists) {
      return res.status(400).json({ message: "Username already taken" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      username,
      email,
      password: hashedPassword,
    });

    const token = generateToken(newUser._id);

    res.status(201).json({
      _id: newUser._id,
      username: newUser.username,
      email: newUser.email,
      profilePic: newUser.profilePic,
      token,
    });
  } catch (error) {
    console.log("Signup Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= LOGIN =================
// Accepts either email or username in the `email` field
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Determine if the user typed an email or a username
    const isEmail = email.includes("@");
    const user = isEmail
      ? await User.findOne({ email })
      : await User.findOne({ username: email }); // reuse `email` field as identifier

    if (!user) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, user.password);
    if (!isPasswordCorrect) {
      return res.status(400).json({ message: "Invalid credentials" });
    }

    const token = generateToken(user._id);

    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      token,
    });
  } catch (error) {
    console.log("Login Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= LOGOUT =================
export const logout = (req, res) => {
  try {
    res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    console.log("Logout Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= UPDATE PROFILE =================
export const updateProfile = async (req, res) => {
  try {
    const userId = req.user._id;
    const { profilePic } = req.body;

    if (!profilePic) {
      return res.status(400).json({ message: "Profile pic is required" });
    }

    // Upload base64 image to Cloudinary
    const uploadResponse = await cloudinary.uploader.upload(profilePic, {
      folder: "profile_pics",
    });

    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { profilePic: uploadResponse.secure_url },
      { new: true }
    ).select("-password");

    res.status(200).json(updatedUser);
  } catch (error) {
    console.log("Update Profile Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// ================= CHECK AUTH =================
export const checkAuth = (req, res) => {
  try {
    res.status(200).json(req.user);
  } catch (error) {
    console.log("CheckAuth Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// ================= GOOGLE AUTH =================
export const googleAuth = async (req, res) => {
  try {
    const { credential } = req.body;
    
    if (!credential) {
      return res.status(400).json({ message: "Credential is required" });
    }

    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { email, name, picture } = payload;
    
    let user = await User.findOne({ email });
    
    if (!user) {
      // Derive a username from the Google display name (spaces → underscores)
      let baseUsername = name.replace(/\s+/g, "_");
      let username = baseUsername;
      let suffix = 1;

      // Ensure uniqueness by appending a number if the username is taken
      while (await User.findOne({ username })) {
        username = `${baseUsername}_${suffix++}`;
      }

      const randomPassword = Math.random().toString(36).slice(-10) + Math.random().toString(36).slice(-10);
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(randomPassword, salt);
      
      user = await User.create({
        username,
        email,
        password: hashedPassword,
        profilePic: picture,
      });
    }
    
    const token = generateToken(user._id);
    
    res.status(200).json({
      _id: user._id,
      username: user.username,
      email: user.email,
      profilePic: user.profilePic,
      token,
    });
  } catch (error) {
    console.log("Google Auth Error:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};