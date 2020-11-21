import crypto from "crypto";

import Post from "../model/posts.js";

export default {
  async like(req, res) {
    const { postID } = req.body;
    const loggedUsername = req.user.username;

    const post = await Post.findOne({ id: postID });
    if (!post) return res.status(404).json({ error: "post not found" });

    const likeIndex = post.likes.findIndex(
      (l) => l.username === loggedUsername
    );

    if (likeIndex < 0) {
      post.likes.push({
        username: loggedUsername,
        createdAt: new Date().toISOString(),
        id: crypto.randomBytes(10).toString("hex"),
      });
    } else {
      post.likes.splice(likeIndex, 1);
    }
    await post.save();
    res.json(post);
  },
};
