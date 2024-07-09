import { Hono } from "hono";
import mongoose from "mongoose";
import UserSchema from "../../schemas/UserSchema";
import jwt from "jsonwebtoken";
import { setCookie, getCookie } from "hono/cookie";
import bcrypt from "bcryptjs";

const AuthenticationAPI = (app: Hono, currentTimeServer: string) => {
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
      username: user.username,
      email: user.email,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET.toString(), {
      algorithm: "HS256",
    });
    setCookie(c, "token", token);

    await User.create(user);

    return c.json({
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
      return c.json(
        {
          message: "Incorrect username or password. Please try again!",
        },
        404
      );
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return c.json({ message: "Invalid password!" }, 400);
    }

    const payload = {
      username: user.username,
      email: user.email,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET.toString(), {
      algorithm: "HS256",
    });
    setCookie(c, "token", token);
    return c.json({ token });
  });

  app.use("verifyToken", async (c) => {
    const token = getCookie(c, "token");
    if (!token) {
      return c.json({ message: "No token provided" }, 401);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET.toString()) as {
        email: string;
        username: string;
      };
      const User = mongoose.model("User", UserSchema);
      const user = await User.findOne({ email: decoded.email });
      return c.json({
        payload: {
          username: user.username,
          email: user.email,
          isAdmin: user.isAdmin,
        },
      });
    } catch (error) {
      return c.json({ message: "Token is not valid" }, 401);
    }
  });
};

export default AuthenticationAPI;
