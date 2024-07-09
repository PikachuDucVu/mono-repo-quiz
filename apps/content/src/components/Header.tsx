/* eslint-disable @typescript-eslint/no-explicit-any */
import Lottie from "lottie-react";
import { useContext, useEffect, useState } from "react";
import { Link } from "wouter";
import { useLocation } from "wouter";
import logoImg from "/logoApp.png";
import Cookies from "js-cookie";
import { toast } from "react-toastify";
import { AuthContext } from "../context/authen";

const Header = () => {
  const [WriteBoardAnim, setWriteBoardAnim] = useState();

  const { userInfo, isLoggedIn, setLoggedIn } = useContext(AuthContext);

  useEffect(() => {
    import("../animations/WriteBoardAnim.json").then((data: any) => {
      setWriteBoardAnim(data.default);
    });
  }, []);

  const [location] = useLocation();

  return (
    <div className="flex w-full">
      <div className="flex flex-1 justify-center items-center border-b">
        <div className="flex w-full px-5 py-5 items-center justify-between ">
          <Link to="/" className="flex items-center">
            <Lottie
              animationData={WriteBoardAnim}
              className="relative w-16 left-3"
            />
            <img src={logoImg} />
          </Link>

          {location !== "/login" && location !== "/register" && !isLoggedIn && (
            <div className="hidden lg:flex gap-5 items-center">
              <Link
                className="px-5 py-2 border-yellow-600 border font-bold"
                to="/login"
              >
                Login / Register
              </Link>
            </div>
          )}

          {location !== "/login" && location !== "/register" && isLoggedIn && (
            <div className="hidden md:flex gap-5 items-center">
              <div className="flex items-center gap-2">
                <img
                  src="https://www.pngkey.com/png/full/114-1149878_setting-user-avatar-in-specific-size-without-breaking.png"
                  className="w-10 h-10 rounded-full"
                />
                <div className="flex flex-col items-start">
                  <div className="font-bold">{userInfo?.username}</div>
                  <div className="text-xs text-gray-500">{userInfo?.email}</div>
                </div>
              </div>
              <div>
                <button
                  onClick={() => {
                    Cookies.remove("token");
                    setLoggedIn(false);
                    toast("Logout successful!", {
                      type: "success",
                      autoClose: 2000,
                    });
                  }}
                  className="px-5 py-2 border-yellow-600 border font-bold"
                >
                  Logout
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
