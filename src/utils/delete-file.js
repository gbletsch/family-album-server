import fs from "fs";
import path from "path";
import aws from "aws-sdk";
import dotenv from "dotenv";
dotenv.config();

export default function deleteFile(fileURL) {
  const args = process.argv.slice(2);
  const splitted = fileURL.split("/");
  const filename = splitted[splitted.length - 1];
  if (args && args[0] === "local-storage") {
    const filepath = path.resolve(path.resolve(), "temp", "uploads", filename);

    fs.unlink(filepath, (error) => {
      if (error) console.log("delete -> error", error);
    });
  } else {
    const s3 = new aws.S3({
      accessKeyId: process.env.AWS_ACCESS_KEY_ID,
      secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
    });
    s3.deleteObject({
      Bucket: process.env.BUCKET_NAME,
      Key: filename,
    }).promise();
  }
}
