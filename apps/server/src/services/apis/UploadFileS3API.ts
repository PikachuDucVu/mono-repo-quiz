import jwt from "jsonwebtoken";
import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { getCookie } from "hono/cookie";
import mongoose from "mongoose";
import UserSchema from "../../schemas/UserSchema";
import {
  PutObjectCommand,
  S3Client,
  ListObjectsV2Command,
  GetObjectCommand,
} from "@aws-sdk/client-s3";
import { s3MindXConfig, s3QuizConfig } from "../../utils/s3aws";

const s3Quiz = new S3Client({
  credentials: {
    accessKeyId: s3QuizConfig.accessKeyId,
    secretAccessKey: s3QuizConfig.secretAccessKey,
  },
  region: s3QuizConfig.region,
});

const s3MindX = new S3Client({
  credentials: {
    accessKeyId: s3MindXConfig.accessKeyId,
    secretAccessKey: s3MindXConfig.secretAccessKey,
  },
  region: s3MindXConfig.region,
});

export const UploadFile = async (app: Hono) => {
  app.post("file/upload", async (c) => {
    const { file, username, docType } = (await c.req.parseBody()) as {
      file: File;
      username: string;
      docType: "spck" | "test";
    };

    console.log(file, username, docType);

    if (!file) {
      return c.text("File not found", 400);
    }
    if (!docType || !["spck", "test"].includes(docType)) {
      return c.text("File type not supported", 400);
    }
    if (!username) {
      return c.text("Username not found", 400);
    }

    const fileBuffer = Buffer.from(await file.arrayBuffer());

    const uploadParams = {
      Bucket: s3MindXConfig.bucket,
      Key: `${docType}/${username}/${file.name}`,
      Body: fileBuffer,
      ContentType: file.type,
    };

    try {
      await s3MindX.send(new PutObjectCommand(uploadParams));
    } catch (err) {
      console.error(err);
      return c.text("Failed to upload file", 500);
    }

    return c.json({ message: "Uploaded successfully!", success: true });
  });
};

export const GetAllFilesSPCK = async (app: Hono) => {
  app.get("files", async (c) => {
    const listParams = {
      Bucket: s3MindXConfig.bucket,
    };

    try {
      const data = await s3MindX.send(new ListObjectsV2Command(listParams));
      console.log(data);
      return c.json({ files: data.Contents, success: true });
    } catch (err) {
      console.error(err);
      return c.text("Failed to list files", 500);
    }
  });
};

export const DownloadFile = async (app: Hono) => {
  app.post("file/download", async (c) => {
    const { fileName, docType } = await c.req.json();
    console.log(await c.req.json());
    const listParams = {
      Bucket: s3MindXConfig.bucket,
      Key: `${docType}/${fileName}`,
    };

    try {
      const command = new GetObjectCommand(listParams);
      const { Body, ContentType } = await s3MindX.send(command);

      c.header("Content-Type", ContentType);
      c.header("Content-Disposition", `attachment; filename="${fileName}"`);
      console.log("done");
      return c.body(Body);
    } catch (err) {
      console.error(err);
      return c.text("Failed to download file", 500);
    }
  });
};

export const UploadImage = async (app: Hono) => {
  app.use(
    "/user/*",
    bearerAuth({
      verifyToken: async (token, c) => {
        return token === getCookie(c, "userToken");
      },
    })
  );

  app.post("user/image/upload", async (c) => {
    const token = getCookie(c, "userToken");
    const body = await c.req.parseBody();
    const imageFile = body["image"] as File;
    const fileBuffer = Buffer.from(await imageFile.arrayBuffer());

    console.log(s3QuizConfig);

    const decoded = jwt.verify(token, process.env.JWT_SECRET.toString()) as {
      email: string;
      username: string;
    };

    if (!decoded.email) {
      return c.text("Invalid token", 400);
    }

    const User = mongoose.model("User", UserSchema);
    const user = await User.findOne({ email: decoded.email });
    if (!user) {
      return c.text("User not found", 404);
    }

    const uploadParams = {
      Bucket: s3QuizConfig.bucket,
      Key: `user/${user._id}`,
      Body: fileBuffer,
      ContentType: imageFile.type,
    };

    try {
      await s3Quiz.send(new PutObjectCommand(uploadParams));
      await user.updateOne({
        userData: {
          imgUrl: `https://${s3QuizConfig.bucket}.s3.${s3QuizConfig.region}.amazonaws.com/user/${user._id}`,
        },
      });
    } catch (err) {
      console.error(err);
      return c.text("Failed to upload image", 500);
    }

    return c.json({ message: "Uploaded successfully!", success: true });
  });
};
