import { FaUserCircle } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri"; // Add this line
import { CommonButton } from "../components/common/CommonButton";
import { useState } from "react";
import { QuizAppAPI } from "../utils/apis/QuizAppAPI";
import { Link, useLocation } from "wouter";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const [, navigate] = useLocation();

  const handleAuth = async () => {
    if (!email || !password) {
      alert("Please fill in all fields");
      return;
    }

    const regexEmail = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
    if (!regexEmail.test(email)) {
      alert("Invalid email");
      return;
    }

    const { token } = await QuizAppAPI.loginWithEmailandPassword(
      email,
      password
    );
    if (token) {
      alert("Login success");
      navigate("/");
    }
  };

  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="bg-white w-2/5 flex flex-col justify-center items-center h-[75%] relative -top-10 rounded-xl">
        <div className="text-2xl font-bold p-5 -mt-10">LOGIN</div>
        <div className="flex flex-col gap-5 w-3/5">
          <div className="flex w-full border-b-2 border-black gap-2 items-center p-1">
            <FaUserCircle />
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
          <div className="text-xs text-gray-500 text-right w-full cursor-pointer">
            Forgot password?
          </div>
          <CommonButton text="Login" onClick={handleAuth} />
          <div className="flex w-full gap-3">
            <CommonButton
              text="Login with Google"
              secondaryStyle
              className="w-[50%] text-sm py-3"
              disableDefaultPadding
            />
            <CommonButton
              text="Login with Facebook"
              secondaryStyle
              disableDefaultPadding
              className="w-[50%] text-sm py-3"
            />
          </div>
        </div>

        <Link
          to="/register"
          className="text-xs text-gray-500 text-center w-full cursor-pointer absolute bottom-10"
        >
          Don't have an account? Register
        </Link>
      </div>
    </div>
  );
};

export default LoginScreen;
