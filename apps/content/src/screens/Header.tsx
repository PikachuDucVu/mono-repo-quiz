import { Link } from "wouter";

const Header = () => {
  return (
    <div className="flex w-full">
      <div className="flex flex-1 justify-center items-center border-b">
        <div className="flex w-full px-5 py-5 items-center justify-between ">
          <img src="logoApp.png" />
          <div className="hidden lg:flex gap-5 items-center">
            <Link to="/">Home</Link>
            <Link to="/feature">Features</Link>
            <Link to="/about">About us</Link>
            <Link
              className="px-5 py-2 border-yellow-600 border font-bold"
              to="/login"
            >
              Login
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Header;
