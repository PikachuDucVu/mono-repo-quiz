import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Link } from "wouter";
import { useState } from "react";
import { QuizAppAPI } from "@/utils/apis/QuizAppAPI";
import { toast } from "react-toastify";

export function LoginScreen() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleAuth = async () => {
    if (!email || !password) {
      toast("Please fill all the fields", {
        type: "error",
        autoClose: 1000,
      });
      return;
    }

    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regexEmail.test(email)) {
      toast("Please enter a valid email", {
        type: "error",
        autoClose: 1000,
      });
      return;
    }

    try {
      const { token } = await QuizAppAPI.login(email.toLowerCase(), password);
      if (token) {
        toast("Login successful! Redirecting...", {
          type: "success",
          autoClose: 1000,
          onClose: () => {
            window.location.href = "/quizlist";
          },
        });
      }
    } catch (error) {
      toast(`${error.response.data.message || "Failed to login"}`, {
        type: "error",
        autoClose: 1000,
      });
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-primary to-secondary">
      <div className="mx-auto w-full max-w-md space-y-6 rounded-lg bg-card p-6 shadow-lg relative -top-10">
        <div className="space-y-2 text-center">
          <h1 className="text-3xl font-bold text-foreground">Welcome back</h1>
        </div>
        <div className="space-y-1">
          <Label htmlFor="username" className="text-foreground">
            Username
          </Label>
          <Input
            id="username"
            placeholder="Enter your username"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="border-2 border-primary focus:border-primary-foreground"
          />
        </div>
        <div className="space-y-1">
          <div className="flex items-center justify-between">
            <Label htmlFor="password" className="text-foreground">
              Password
            </Label>
            <Link
              href="#"
              className="text-sm font-medium underline underline-offset-4 hover:text-primary-foreground"
            >
              Forgot password?
            </Link>
          </div>
          <Input
            id="password"
            type="password"
            placeholder="Enter your password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="border-2 border-primary focus:border-primary-foreground"
          />
        </div>
        <Button
          onClick={handleAuth}
          className="w-full bg-primary text-primary-foreground hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
        >
          Sign in
        </Button>
      </div>
    </div>
  );
}
