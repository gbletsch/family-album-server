import mongoose from "mongoose";

const instance = mongoose.Schema({
  id: String,
  username: String,
  caption: String,
  image: [String],
  likes: [
    {
      id: String,
      username: String,
      createdAt: String,
    },
  ],
  comments: [
    {
      id: String,
      username: String,
      body: String,
      createdAt: String,
    },
  ],
  createdAt: String,
  updatedAt: String,
});

export default mongoose.model("Post", instance);
