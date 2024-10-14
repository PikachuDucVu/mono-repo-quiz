import { createContext, useState } from "react";
import Loading from "../animations/Loading.json";
import Lottie from "lottie-react";
import { motion } from "framer-motion";

const LoadingContext = createContext({
  isLoading: false,
  setLoading: (_isLoading: boolean) => {},
});

const LoadingProvider = ({ children }: { children: React.ReactNode }) => {
  const [isLoading, setLoading] = useState(false);
  return (
    <LoadingContext.Provider
      value={{
        isLoading,
        setLoading,
      }}
    >
      {isLoading && (
        <motion.div
          className="absolute bg-slate-400/50 flex justify-center items-center w-full h-full z-50"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <Lottie animationData={Loading} loop autoplay className="" />
        </motion.div>
      )}
      {children}
    </LoadingContext.Provider>
  );
};

export { LoadingContext, LoadingProvider };
