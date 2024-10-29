import { Link, useLocation } from "wouter";
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
import { toast } from "react-toastify";
import { AdminAPI } from "@/utils/apis/AdminAPI";

const Header = () => {
  const { userInfo, isLoggedIn, setLoggedIn } = useContext(AuthContext);

  const [WriteBoardAnim, setWriteBoardAnim] = useState();
  const [location, navigate] = useLocation();
  useEffect(() => {
    import("../animations/WriteBoardAnim.json").then((data) => {
      setWriteBoardAnim(data.default as never);
    });
  }, []);

  const handleLogout = useCallback(async () => {
    await AdminAPI.logout();
    setLoggedIn(false);
    toast("Logout successful!", {
      type: "success",
      autoClose: 1000,
      onClose: () => {
        window.location.href = "/";
      },
    });
  }, [setLoggedIn]);

  return (
    <header className="sticky top-0 left-0 right-0 z-50 px-4 lg:px-6 h-14 flex items-center justify-between border-b bg-muted ">
      <Link href="/" className="flex items-center justify-center gap-4">
        <Lottie
          animationData={WriteBoardAnim}
          className="relative w-12 left-3"
        />
      </Link>
      <nav className="flex items-center gap-4 sm:gap-6">
        <div className="flex gap-2">
          {!isLoggedIn ? (
            <>
              {location !== "/login" && (
                <Link
                  href="/login"
                  className="inline-flex items-center justify-center rounded-md bg-primary px-4 py-2 text-sm font-medium text-primary-foreground shadow transition-colors hover:bg-primary/90 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50"
                >
                  Login
                </Link>
              )}
            </>
          ) : (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full">
                    <Avatar className="h-8 w-8 border">
                      <AvatarImage src={userInfo?.userData?.imgUrl} />
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

                  <DropdownMenuItem
                    onClick={() => {
                      navigate("/profiles");
                    }}
                  >
                    <div className="flex items-center gap-2">
                      <div className="h-4 w-4" />
                      <span>Settings</span>
                    </div>
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
