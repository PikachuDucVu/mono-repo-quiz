import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { QuizAppAPI } from "@/utils/apis/QuizAppAPI";
import { toast } from "react-toastify";

export function RegisterScreen() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handleAuth = async () => {
    if (!email || !password || !username || !confirmPassword) {
      toast("Please fill in all fields", {
        type: "error",
        autoClose: 2000,
      });
      return;
    }

    if (password !== confirmPassword) {
      toast("Passwords do not match", {
        type: "error",
        autoClose: 2000,
      });
      return;
    }

    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regexEmail.test(email)) {
      toast("Invalid email", {
        type: "error",
        autoClose: 2000,
      });
      return;
    }

    try {
      const { token } = await QuizAppAPI.registerWithEmailandPassword(
        username,
        email,
        password
      );
      if (token) {
        toast("Registration successful! Redirecting...", {
          type: "success",
          autoClose: 2000,
          onClose: () => {
            window.location.href = "/admin";
          },
        });
      }
    } catch (error) {
      toast(`${error.response.data.message || "Failed to register"}`, {
        type: "error",
        autoClose: 2000,
      });
    }
  };

  return (
    <div className="flex justify-center items-center h-screen bg-background">
      <Card className="w-full max-w-md">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">Register</CardTitle>
          <CardDescription>Create your account</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                placeholder="Enter your name"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <Input
              id="password"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <Input
              id="confirm-password"
              type="password"
              placeholder="Confirm your password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleAuth}>
            Register
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
