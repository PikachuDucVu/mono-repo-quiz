import { basicAuth } from "hono/basic-auth";

export const setupAdminAuth = basicAuth({
  verifyUser: (username, password, ctx) => {
    if (username !== "admin") {
      return false;
    }
    if (password !== ctx.env.SETUP_ADMIN_PASSWORD) {
      return false;
    }
    return true;
  },
});
