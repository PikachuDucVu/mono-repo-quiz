/* eslint-disable @typescript-eslint/no-explicit-any */
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { Link } from "wouter";
import { useLocation } from "wouter";
import logoImg from "/logoApp.png";

const Header = () => {
  const [WriteBoardAnim, setWriteBoardAnim] = useState();

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
          {location !== "/login" && (
            <div className="hidden lg:flex gap-5 items-center">
              <Link
                className="px-5 py-2 border-yellow-600 border font-bold"
                to="/login"
              >
                Login / Register
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Header;
