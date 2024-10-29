import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import { User } from "../utils/types";
import { toast } from "react-toastify";
import { QuizAppAPI } from "../utils/apis/QuizAppAPI";
import Cookies from "js-cookie";
import { LoadingContext } from "./loading";
const AuthContext = createContext({
  isLoggedIn: false,
  userInfo: undefined as User,
  setLoggedIn: (_isLoggedIn: boolean) => {},
  callVerifyToken: () => {},
});

const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const { setLoading } = useContext(LoadingContext);
  const [isLoggedIn, setLoggedIn] = useState(false);
  const [userInfo, setUserInfo] = useState<User>();

  const handleVerifyToken = useCallback(async () => {
    setLoading(true);
    const token = Cookies.get("userToken");
    if (token) {
      try {
        const res = await QuizAppAPI.verifyToken();
        if (res) {
          setLoggedIn(true);
          res.payload && setUserInfo(res.payload);
        }
        if (res.message) {
          Cookies.remove("userToken");
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

    setLoading(false);
  }, [setLoading]);

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
