import jwt from "jsonwebtoken";
import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { getCookie } from "hono/cookie";
import { connectMongoose } from "../mongoose";
import mongoose from "mongoose";
import UserSchema from "../../schemas/UserSchema";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import s3Config from "../../utils/s3aws";

const s3 = new S3Client({
  credentials: {
    accessKeyId: s3Config.accessKeyId,
    secretAccessKey: s3Config.secretAccessKey,
  },
  region: s3Config.region,
});

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

    console.log(s3Config);

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
      Bucket: s3Config.bucket,
      Key: `user/${user._id}`,
      Body: fileBuffer,
      ContentType: imageFile.type,
    };

    try {
      await s3.send(new PutObjectCommand(uploadParams));
      await user.updateOne({
        userData: {
          imgUrl: `https://${s3Config.bucket}.s3.${s3Config.region}.amazonaws.com/user/${user._id}`,
        },
      });
    } catch (err) {
      console.error(err);
      return c.text("Failed to upload image", 500);
    }

    return c.json({ message: "Uploaded successfully!", success: true });
  });
};
