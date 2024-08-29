import { createContext, useCallback, useEffect, useState } from "react";
import { User } from "../utils/types";
import { toast } from "react-toastify";
import { QuizAppAPI } from "../utils/apis/QuizAppAPI";
import Cookies from "js-cookie";
const AuthContext = createContext({
  isLoggedIn: false,
  userInfo: null,
  setLoggedIn: (isLoggedIn: boolean) => {},
  callVerifyToken: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<User>();

  const handleVerifyToken = useCallback(async () => {
    const token = Cookies.get("token");
    console.log("verify token", token);
    if (token) {
      try {
        const res = await QuizAppAPI.verifyToken();
        if (res) {
          setLoggedIn(true);
          res.payload && setUserInfo(res.payload);
        }
        if (res.message) {
          Cookies.remove("token");
          toast(res.message, {
            type: "error",
            autoClose: 2000,
            onClose: () => {
              setLoggedIn(false);
            },
          });
          setLoggedIn(false);
        }
      } catch (error) {
        console.error(error);
      }
    }
  }, []);

  useEffect(() => {
    handleVerifyToken();
  }, [handleVerifyToken]);

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn,
        userInfo,
        setLoggedIn,
        callVerifyToken: handleVerifyToken,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export { AuthContext, AuthProvider };
