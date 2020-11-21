import aws from "aws-sdk";
import crypto from "crypto";
import multer from "multer";
import multerS3 from "multer-s3";
import path from "path";

import dotenv from "dotenv";
dotenv.config();

const storagetypes = {
  local: multer.diskStorage({
    destination: (req, file, cb) => {
      cb(null, path.resolve(path.resolve(), "temp", "uploads"));
    },
    filename: (req, file, cb) => {
      crypto.randomBytes(16, (err, hash) => {
        if (err) cb(err);
        file.key = `${hash.toString("hex")}-${file.originalname}`;
        cb(null, file.key);
      });
    },
  }),
  s3: multerS3({
    s3: new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    }),
    bucket: process.env.BUCKET_NAME,
    contentType: multerS3.AUTO_CONTENT_TYPE,
    acl: "public-read",
    key: (req, file, cb) => {
      const hash = crypto.randomBytes(16).toString("hex");
      const filename = `${hash}-${file.originalname}`;
      cb(null, filename);
    },
  }),
};

let type = "s3";
if (process.argv.slice(2)[0] === "local-storage") {
  type = "local";
}

const instance = multer({
  storage: storagetypes[type],
  limits: {
    fileSize: 2 * 1024 * 1024,
  },
  fileFilter: (req, file, cb) => {
    const allowedMimes = [
      "image/jpg",
      "image/pjpeg",
      "image/jpeg",
      "image/png",
      "image/gif",
    ];
    if (allowedMimes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      cb(new Error("invalid file type"));
    }
  },
});

export default instance;
