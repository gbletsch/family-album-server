import cors from "cors";
import express from "express";
import mongoose from "mongoose";
import morgan from "morgan";
import path from "path";
import dotenv from "dotenv";
dotenv.config();

import routes from "./routes.js";

const app = express();
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
app.use(cors());
app.use(morgan("dev"));
app.use("/uploads", express.static(path.join("temp", "uploads")));
app.use(routes);

const port = process.env.PORT || 8080;
const args = process.argv.slice(2);

let mongo_connection_url = process.env.MONGODB_CONNECT_STRING;

if (args[1] === "local-db")
  mongo_connection_url = "mongodb://0.0.0.0:27017/mongodb";

mongoose
  .connect(mongo_connection_url, {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("mongo db is connected");
  })
  .catch((error) => {
    console.log("error", error);
  });

const server = app.listen(8080, () =>
  console.log(`app running on port ${port}, using args ${args}`)
);

process.once("SIGUSR2", function () {
  server.close(function () {
    process.kill(process.pid, "SIGUSR2");
  });
});
