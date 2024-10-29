import { User } from "./../../../../admin/src/utils/types";
import jwt from "jsonwebtoken";
import { Hono } from "hono";
import { bearerAuth } from "hono/bearer-auth";
import { deleteCookie, getCookie, setCookie } from "hono/cookie";
import mongoose from "mongoose";
import UserSchema from "../../schemas/UserSchema";
import bcrypt from "bcryptjs";

const AdminAPI = (app: Hono) => {
  app.use(
    "/admin/*",
    bearerAuth({
      verifyToken: async (token, c) => {
        return token === getCookie(c, "adminToken");
      },
    })
  );

  app.use("admin/verifyToken", async (c) => {
    const token = getCookie(c, "adminToken");
    if (!token) {
      return c.json({ message: "No token provided" }, 401);
    }

    try {
      const decoded = jwt.verify(token, process.env.JWT_SECRET.toString()) as {
        email: string;
        username: string;
        userData?: any;
        role: string;
        status: string;
      };
      const User = mongoose.model("User", UserSchema);
      const user = await User.findOne({ email: decoded.email, role: "admin" });

      if (!user) {
        return c.json(
          { message: "No admin found or you're not an admin" },
          404
        );
      }

      if (user.status === "banned") {
        return c.json({ message: "Your account has been banned!" }, 404);
      }

      return c.json({
        payload: {
          id: user._id,
          username: user.username,
          email: user.email,
          userData: user.userData,
          role: user.role,
          status: user.status,
        },
      });
    } catch (error) {
      return c.json({ message: "Token is not valid" }, 401);
    }
  });

  app.get("admin/getDashboard", (c) => {
    return c.json({ message: "Get dashboard" });
  });

  app.post("/adminLogin", async (c) => {
    const body = await c.req.json();
    const { email, password } = body;
    if (!email || !password) {
      return c.json({ message: "Invalid data!" }, 400);
    }

    const User = mongoose.model("User", UserSchema);

    const admin = await User.findOne({ email });
    const isMatch = await bcrypt.compare(password, admin.password);

    if (!admin || !isMatch) {
      return c.json(
        {
          message: "Incorrect username or password. Please try again!",
        },
        404
      );
    }

    if (admin.role !== "admin") {
      return c.json(
        {
          message: "You are not an admin!",
        },
        404
      );
    }

    if (admin.status === "banned") {
      return c.json(
        {
          message: "Your account has been banned!",
        },
        404
      );
    }

    const payload = {
      username: admin.username,
      email: admin.email,
      userData: admin.userData,
      role: admin.role,
      status: admin.status,
    };

    const token = jwt.sign(payload, process.env.JWT_SECRET.toString(), {
      algorithm: "HS256",
    });

    setCookie(c, "adminToken", token);

    return c.json({
      token,
    });
  });

  app.get("admin/getUsers", async (c) => {
    const User = mongoose.model("User", UserSchema);
    const users = await User.find();

    return c.json({ users });
  });
  app.post("admin/addUser", async (c) => {
    const newUserData = (await c.req.json()) as User;

    const User = mongoose.model("User", UserSchema);
    const existingUser = await User.findOne({ email: newUserData.email });

    if (existingUser) {
      return c.json({ message: "User already exists" }, 400);
    }

    if (!newUserData.username || !newUserData.email || !newUserData.password) {
      return c.json({ message: "Invalid data!" }, 400);
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newUserData.password, salt);

    newUserData.password = hashedPassword;

    await User.create(newUserData);

    return c.json({ message: "User created successful" });
  });
  app.put("admin/updateUser", async (c) => {
    const data = await c.req.json();

    const User = mongoose.model("User", UserSchema);
    const user = await User.findById(data._id);

    if (!user) {
      return c.json({ message: "User not found" }, 404);
    }

    await user.updateOne(data);

    return c.json({ message: "Updated successful" });
  });

  app.get("admin/getQuestionnaires", (c) => {
    return c.json({ message: "Get all questionnaires" });
  });
  app.get("admin/getHistoriesQuestionnaire", (c) => {
    return c.json({ message: "Get all histories questionnaire" });
  });
  app.get("admin/getStatisticsQuestionnaire/:id", (c) => {
    return c.json({ message: "Get statistics of questionnaire" });
  });

  app.post("admin/addQuestionnaire", (c) => {
    return c.json({ message: "Add new questionnaire" });
  });
  app.put("admin/updateQuestionnaire", (c) => {
    return c.json({ message: "Update questionnaire" });
  });
};

export default AdminAPI;
