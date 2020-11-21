import crypto from "crypto";

import Post from "../model/posts.js";

export default {
  async create(req, res) {
    const { postID, body } = req.body;
    const commentOwnerUsername = req.user.username;
    const id = crypto.randomBytes(10).toString("hex");

    const post = await Post.findOne({ id: postID });
    post.comments.push({
      id,
      username: commentOwnerUsername,
      body,
      createdAt: new Date().toISOString(),
    });
    await post.save();
    res.json(post);
  },
  async delete(req, res) {
    const { postID, commentID } = req.params;
    const loggedUsername = req.user.username;

    const post = await Post.findOne({ id: postID });
    if (!post) return res.status(404).json({ error: "post not found" });

    const commentIndex = post.comments.findIndex((c) => c.id === commentID);
    if (commentIndex < 0)
      return res.status(400).json({ error: "comment not found" });

    const commentOwnerUsername = post.comments[commentIndex].username;
    if (![commentOwnerUsername, post.username].includes(loggedUsername))
      return res
        .status(403)
        .json({ error: "only post or comment owner can delete comment" });

    post.comments.splice(commentIndex, 1);
    await post.save();

    res.json(post);
  },
};
