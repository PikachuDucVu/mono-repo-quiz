import { Hono } from "hono";
import mongoose from "mongoose";
import UserSchema from "../../schemas/UserSchema";
import jwt from "jsonwebtoken";
import { setCookie, getCookie } from "hono/cookie";
import { bearerAuth } from "hono/bearer-auth";
import bcrypt from "bcryptjs";

const AuthenticationAPI = (app: Hono, currentTimeServer: string) => {
  // app.use(
  //   "/user/*",
  //   bearerAuth({
  //     verifyToken: async (token, c) => {
  //       console.log("verifyToken", token, getCookie(c, "token"));
  //       return token === getCookie(c, "token");
  //     },
  //   })
  // );

  app.post("/register", async (c) => {
    const body = await c.req.json();
    const { username, email, password } = body;

    if (!username || !email || !password) {
      return c.json({ message: "Invalid data!" }, 400);
    }

    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regexEmail.test(email)) {
      return c.json({ message: "Invalid email!" }, 400);
    }

    const User = mongoose.model("User", UserSchema);

    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return c.json({ message: "User already exsits with this email!" }, 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const user = {
      username,
      email,
      password: hashedPassword,
    };

    const payload = {
      ...user,
      exp: Math.floor(Date.now() / 1000) + 60 * 60,
    };

    const token = jwt.sign(payload, "dcm", {
      algorithm: "HS256",
    });
    setCookie(c, "token", token);

    await User.create(user);

    return c.json({
      payload,
      token,
    });
  });

  app.post("/login", async (c) => {
    const body = await c.req.json();
    const { email, password } = body;
    if (!email || !password) {
      return c.json({ message: "Invalid data!" }, 400);
    }

    const User = mongoose.model("User", UserSchema);

    const user = await User.findOne({ email });
    if (!user) {
      return c.json({ message: "User not found!" }, 404);
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return c.json({ message: "Invalid password!" }, 400);
    }

    const payload = {
      email,
      password,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET.toString(), {
      algorithm: "HS256",
    });
    setCookie(c, "token", token);

    return c.json({ payload, token });
  });
};

export default AuthenticationAPI;
