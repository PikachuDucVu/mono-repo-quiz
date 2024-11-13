import { useCallback, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { LockIcon, MailIcon } from "lucide-react";
import { AdminAPI } from "@/utils/apis/AdminAPI";
import { toast } from "react-toastify";

export function AdminLogin() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const handleSubmit = useCallback(async () => {
    setError("");
    if (!email || !password) {
      setError("Please fill in all fields");
    } else {
      try {
        await AdminAPI.login(email.toLowerCase(), password);

        toast("Login successful! Redirecting...", {
          type: "success",
          autoClose: 1000,
          onClose: () => {
            window.location.href = "/admin/dashboard";
          },
        });
      } catch (error) {
        setError(error.response.data.message || "Failed to login");
      }
    }
  }, [email, password]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <Card className="w-full max-w-md">
        <CardHeader className="space-y-1">
          <div className="flex justify-center mb-4">
            <div className="w-12 h-12 bg-primary rounded-full flex items-center justify-center">
              <LockIcon className="text-primary-foreground" />
            </div>
          </div>
          <CardTitle className="text-2xl text-center font-bold">
            Admin Login
          </CardTitle>
          <CardDescription className="text-center">
            Enter your credentials to access the admin panel
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email">Email</Label>
            <div className="relative">
              <MailIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="email"
                placeholder="admin@example.com"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Password</Label>
            <div className="relative">
              <LockIcon className="absolute left-3 top-3 h-5 w-5 text-muted-foreground" />
              <Input
                id="password"
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
          {error && <p className="text-sm text-red-500">{error}</p>}
        </CardContent>
        <CardFooter>
          <Button className="w-full" onClick={handleSubmit} type="button">
            Login
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
