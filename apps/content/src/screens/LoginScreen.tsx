import { FaUserCircle } from "react-icons/fa";
import { RiLockPasswordFill } from "react-icons/ri"; // Add this line
import { CommonButton } from "../components/common/CommonButton";

const LoginScreen = () => {
  return (
    <div className="flex items-center justify-center h-full w-full">
      <div className="bg-white w-2/5 flex flex-col justify-center items-center h-[75%] relative -top-10 rounded-xl">
        <div className="text-2xl font-bold p-5 -mt-10">LOGIN</div>
        <div className="flex flex-col gap-5 w-3/5">
          <div className="flex w-full border-b-2 border-black gap-2 items-center p-1">
            <FaUserCircle />
            <input type="text" placeholder="Email" className="flex-1 " />
          </div>
          <div className="flex w-full border-b-2 border-black gap-2 items-center p-1">
            <RiLockPasswordFill />
            <input type="password" placeholder="Password" className="w-full" />
          </div>
          <div className="text-xs text-gray-500 text-right w-full cursor-pointer">
            Don't have an account? Register
          </div>
          <CommonButton text="Login" />
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

        <div className="text-xs text-gray-500 text-center w-full cursor-pointer absolute bottom-10">
          Forgot password?
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
