import mongoose from "mongoose";

const userSchema = mongoose.Schema({
  id: String,
  username: {
    type: String,
    required: true,
    unique: true,
  },
  avatar: [String],
  actualAvatar: Number,
  password: {
    type: String,
    required: true,
  },
  createdAt: String,
  updatedAt: String,
});

export default mongoose.model("User", userSchema);
