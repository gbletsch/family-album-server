import bcrypt from "bcrypt";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
import jwt from "jsonwebtoken";

import User from "../model/users.js";
import deleteFile from "../utils/delete-file.js";

export default {
  readAll(req, res) {
    User.find()
      .then((users) => res.json(users))
      .catch((error) => res.status(500).json({ error }));
  },
  async register(req, res) {
    const { username, password, confirmPassword } = req.body;
    const { file } = req;

    if (!password) return res.status(400).json({ error: "empty password" });
    if (password !== confirmPassword)
      return res.status(400).json({ error: "password do not confirm" });
    if (!username) return res.status(400).json({ error: "empty username" });
    const exist = await User.findOne({ username }, "_id").exec();
    if (exist) return res.status(400).json({ error: "repeated username" });

    let avatar = [];

    if (file && process.argv.slice(2)[0] === "local-storage") {
      avatar.unshift(`${process.env.APP_URL}/uploads/${file.key}`);
    } else {
      avatar.unshift(file.location);
    }

    const doc = new User({
      id: crypto.randomBytes(10).toString("hex"),
      username,
      password: bcrypt.hashSync(password, 10),
      avatar,
      actualAvatar: 0,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });

    User.init()
      .then(() => User.create(doc))
      .then((user) => res.status(201).json(user))
      .catch((error) => res.status(400).json({ error }));
  },
  async deleteAll(req, res) {
    const users = await User.find();
    if (users.length > 0) {
      users.forEach((u) => {
        u.avatar.forEach((a) => {
          deleteFile(a);
        });
      });
    }

    User.deleteMany()
      .then((result) => res.json({ result }))
      .catch((error) => res.json({ error }));
  },
  async login(req, res) {
    const { username, password } = req.body;

    let user = await User.findOne({ username }).exec();

    if (!user || !bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ error: "unauthorized" });
    }

    const token = jwt.sign(
      { ...user._doc, password: null },
      process.env.JWT_KEY,
      {
        expiresIn: "30d",
      }
    );
    user.password = null;
    res.json({ user, token });
  },
  async delete(req, res) {
    const { id } = req.params;
    const {
      user: { username },
    } = req;

    const user = await User.findOneAndDelete({ id, username });

    if (!user) {
      return res
        .status(400)
        .json({ error: "user not found or you are not the owner" });
    } else {
      user.avatar.forEach((a) => {
        deleteFile(a);
      });
    }
    res.json(user);
  },
};
