import { FaUserCircle } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri"; // Add this line
import { CommonButton } from "../components/common/CommonButton";
import { useState } from "react";
import { QuizAppAPI } from "../utils/apis/QuizAppAPI";
import { MdEmail } from "react-icons/md";
import { GiConfirmed } from "react-icons/gi";
import { Link, useLocation } from "wouter";
import { toast } from "react-toastify";

const RegisterScreen = () => {
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
    <div className="flex items-center justify-center h-full w-full">
      <div className="bg-white w-2/5 flex flex-col justify-center items-center h-[75%] relative -top-10 rounded-xl">
        <div className="text-2xl font-bold p-5 -mt-10">Register</div>
        <div className="flex flex-col gap-5 w-3/5">
          <div className="flex w-full border-b-2 border-black gap-2 items-center p-1">
            <FaUserCircle />
            <input
              type="text"
              placeholder="Username"
              className="flex-1"
              onChange={(e) => setUsername(e.target.value)}
            />
          </div>

          <div className="flex w-full border-b-2 border-black gap-2 items-center p-1">
            <MdEmail />
            <input
              type="text"
              placeholder="Email"
              className="flex-1 "
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>
          <div className="flex w-full border-b-2 border-black gap-2 items-center p-1">
            <RiLockPasswordFill />
            <input
              type="password"
              placeholder="Password"
              className="w-full"
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>
          <div className="flex w-full border-b-2 border-black gap-2 items-center p-1">
            <GiConfirmed />
            <input
              type="password"
              placeholder="Re-enter Password"
              className="w-full"
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
          </div>

          <div className="text-xs text-gray-500 text-right w-full cursor-pointer">
            Forgot password?
          </div>
          <CommonButton text="Register" onClick={handleAuth} />
        </div>

        <Link
          to="/login"
          className="text-xs text-gray-500 text-center w-full cursor-pointer absolute bottom-10"
        >
          Already have an account? Login
        </Link>
      </div>
    </div>
  );
};

export default RegisterScreen;
