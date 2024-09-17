import { Award, Clock, Home } from "lucide-react";
import { useState, useEffect } from "react";
import { Button } from "./ui/button";
import { Progress } from "./ui/progress";
import { motion } from "framer-motion";
import Congrats from "../animations/Congrats.json";
import Lottie from "lottie-react";
import { useLocation } from "wouter";

const ShowScore = ({
  score,
  totalQuestions,
  endTime,
}: {
  score: number;
  totalQuestions: number;
  endTime?: number;
}) => {
  const [, navigate] = useLocation();

  const [animateScore, setAnimateScore] = useState(0);
  const timeCompleted = "9:58";
  useEffect(() => {
    // Animate examplescorecounting up
    const timer = setInterval(() => {
      setAnimateScore((prevScore) => {
        if (prevScore < score) return prevScore + 1;
        clearInterval(timer);
        return score;
      });
    }, 100);

    return () => clearInterval(timer);
  }, [score]);

  return (
    <div className="min-h-screen bg-gradient-to-b from-green-100 to-blue-100 flex items-center justify-center p-4">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5 }}
        className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full flex flex-col items-center justify-center"
      >
        <Lottie animationData={Congrats} className="w-32 h-32 mx-auto mb-6" />
        <h1 className="text-3xl font-bold text-center mb-6">Quiz Complete!</h1>

        <div className="flex justify-center items-center mb-6 -ml-3">
          <Award className="text-yellow-400 w-16 h-16 mr-4" />
          <div>
            <p className="text-xl font-semibold">Your Score</p>
            <p className="text-4xl font-bold">
              {` ${score} / ${totalQuestions}`}
            </p>
          </div>
        </div>

        <Progress value={(animateScore / score) * 100} className="mb-6" />

        <p className="text-center mb-6">
          Great job! You've answered {score} out of {totalQuestions} questions
          correctly.
        </p>

        <div className="flex items-center justify-center mb-6">
          <Clock className="text-blue-500 w-6 h-6 mr-2" />
          <p className="text-lg font-semibold">
            Time Completed: {timeCompleted}
          </p>
        </div>

        <Button className="w-full" size="lg" onClick={() => navigate("/")}>
          <Home className="mr-2 h-5 w-5" /> Back to Home
        </Button>
      </motion.div>
    </div>
  );
};

export default ShowScore;
