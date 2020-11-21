import { Router } from "express";
import multer from "multer";
import crypto from "crypto";

import multerConfig from "./config/multer.js";
import UsersController from "./controllers/users.js";
import PostsController from "./controllers/posts.js";
import CommentsController from "./controllers/comments.js";
import ReactionsController from "./controllers/reactions.js";
import authorizeJwt from "./middleware/authorize_jwt.js";

const routes = Router();
routes.get("/", (req, res) => {
  return res.send(crypto.randomBytes(10).toString("hex"));
});

routes.get("/users", UsersController.readAll);
routes.delete("/users/deleteAll", UsersController.deleteAll);
routes.post(
  "/register",
  multer(multerConfig).single("file"),
  UsersController.register
);
routes.post("/login", UsersController.login);

// protected routes
routes.use(authorizeJwt);

//posts
routes.post(
  "/posts",
  multer(multerConfig).single("file"),
  PostsController.create
);
routes.get("/posts", PostsController.readAll);
routes.get("/posts/:id", PostsController.read);
routes.delete("/posts/delete/:id", PostsController.delete);
routes.delete("/posts/deleteAll", PostsController.deleteAll);

// comments
routes.post("/comments", CommentsController.create);
routes.delete("/comments/:postID/:commentID", CommentsController.delete);

// reactions
routes.post("/likes", ReactionsController.like);
export default routes;
