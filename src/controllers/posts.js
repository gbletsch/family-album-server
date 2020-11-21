import crypto from "crypto";

import Post from "../model/posts.js";
import deleteFile from "../utils/delete-file.js";

export default {
  async create(req, res) {
    const {
      user: { username },
      body: { caption },
      file,
    } = req;

    let image = [];
    // only in development
    if (file && process.argv.slice(2)[0] === "local-storage") {
      image.unshift(`${process.env.APP_URL}/uploads/${file.key}`);
    } else {
      image.unshift(file.location);
    }

    let post = null;
    try {
      post = await Post.create({
        id: crypto.randomBytes(10).toString("hex"),
        caption,
        username,
        image,
        likes: [],
        comments: [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
      });
    } catch (error) {
      return res.status(500).json({ error });
    }
    res.json({ post });
  },
  async readAll(req, res) {
    const posts = await Post.find();
    return res.json(posts);
  },
  async read(req, res) {
    const { id } = req.params;
    const post = await Post.find({ id });
    return res.json(post);
  },
  async deleteAll(req, res) {
    const posts = await Post.find();
    if (posts.length > 0) {
      posts.forEach((post) => {
        images.forEach((img) => deleteFile(img));
      });
    }

    const result = await Post.deleteMany();
    res.json({ result });
  },
  async delete(req, res) {
    const { id } = req.params;
    const {
      user: { username },
    } = req;

    let post = null;
    post = await Post.findOneAndDelete({ id, username });

    if (!post) {
      return res
        .status(400)
        .json({ error: "post not found or you are not the owner" });
    } else {
      post.image.forEach((i) => {
        deleteFile(i);
      });
    }
    res.json({ post });
  },
};
