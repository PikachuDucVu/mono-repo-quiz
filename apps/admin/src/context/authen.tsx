import { createContext, useCallback, useEffect, useState } from "react";
import { User } from "../utils/types";
import { toast } from "react-toastify";
import { AdminAPI } from "../utils/apis/AdminAPI";
import Cookies from "js-cookie";
const AuthContext = createContext({
  isLoggedIn: false,
  userInfo: undefined as User,
  setLoggedIn: (_isLoggedIn: boolean) => {},
  callVerifyToken: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<User>();

  const handleVerifyToken = useCallback(async () => {
    const token = Cookies.get("adminToken");
    if (token) {
      try {
        const res = await AdminAPI.verifyToken();
        if (res) {
          setLoggedIn(true);
          res.payload && setUserInfo(res.payload);
        }
        if (res.message) {
          Cookies.remove("adminToken");
          toast(res.message, {
            type: "error",
            autoClose: 1000,
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
