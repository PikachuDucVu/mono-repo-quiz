import { Link } from "wouter";
import { ThemeModeToggle } from "./ui/ThemeModeToggle";
import { useCallback, useContext, useEffect, useState } from "react";
import { AuthContext } from "@/context/authen";
import Lottie from "lottie-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import Cookies from "js-cookie";
import { toast } from "react-toastify";

const Header = () => {
  const { userInfo, isLoggedIn, setLoggedIn } = useContext(AuthContext);

  const [WriteBoardAnim, setWriteBoardAnim] = useState();

  useEffect(() => {
    import("../animations/WriteBoardAnim.json").then((data) => {
      setWriteBoardAnim(data.default as never);
    });
  }, []);

  const handleLogout = useCallback(() => {
    Cookies.remove("token");
    setLoggedIn(false);
    toast("Logout successful!", {
      type: "success",
      autoClose: 1000,
      onClose: () => {
        window.location.href = "/";
      },
    });
  }, [setLoggedIn]);

  console.log(userInfo);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 px-4 lg:px-6 h-14 flex items-center justify-between border-b bg-muted ">
      <Link href="/" className="flex items-center justify-center">
        <Lottie
          animationData={WriteBoardAnim}
          className="relative w-12 left-3"
        />
      </Link>
      <nav className="flex items-center gap-4 sm:gap-6">
        <Link
          href="#"
          className="text-sm font-medium hover:underline underline-offset-4 hidden sm:block"
        >
          Categories
        </Link>
        <Link
          href="#"
          className="text-sm font-medium hover:underline underline-offset-4 hidden sm:block"
        >
          Leaderboard
        </Link>
        <Link
          href="#"
          className="text-sm font-medium hover:underline underline-offset-4 hidden sm:block"
        >
          About
        </Link>

        <div className="flex gap-2">
          {!isLoggedIn ? (
            <>
              <Link
                href="/login"
                className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Login
              </Link>
              <Link
                href="/register"
                className="inline-flex items-center justify-center rounded-md border border-input bg-background px-4 py-2 text-sm font-medium shadow-sm transition-colors hover:bg-accent hover:text-accent-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
              >
                Register
              </Link>
            </>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>
                        {userInfo?.username
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <span className="sr-only">Toggle user menu</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <div className="flex items-center gap-2 p-2">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src="/placeholder-user.jpg" />
                      <AvatarFallback>
                        {userInfo?.username
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="grid gap-0.5 leading-none">
                      <div className="font-semibold">{userInfo?.username}</div>
                      <div className="text-sm text-muted-foreground ">
                        {userInfo?.email}
                      </div>
                    </div>
                  </div>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>
                    <Link href="#" className="flex items-center gap-2">
                      <div className="h-4 w-4" />
                      <span>Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link href="#" className="flex items-center gap-2">
                      <div className="h-4 w-4" />
                      <span>Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleLogout}>
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4" />
                      <span>Sign out</span>
                    </div>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}

          <ThemeModeToggle />
        </div>
      </nav>
    </header>
  );
};

export default Header;
