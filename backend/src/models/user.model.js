import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    // username serves as both the display name and the unique login identifier.
    // `unique: true` automatically creates a B-tree unique index — no two users can share a username.
    // Powers: User.findOne({ username }) in login, and signup duplicate check.
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    // `unique: true` automatically creates a B-tree unique index on this field.
    // This index powers:  User.findOne({ email })  — used in login, signup, and Google OAuth.
    // No additional index definition needed here.
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      lowercase: true,
    },
    password: {
      type: String,
      required: true,
    },
    profilePic: {
      type: String,
      default: "",
    },
  },
  { timestamps: true }
);

const User = mongoose.model("User", userSchema);

export default User;
