import { Progress } from "./ui/progress";
import { HourglassIcon } from "lucide-react";
import { Button } from "./ui/button";
import { Card } from "./ui/card";
import { QuestionItem } from "@/utils/types";
import { useContext, useEffect, useState } from "react";
import Timer from "../animations/Timer.json";
import Lottie from "lottie-react";
import { ThemeProviderContext } from "./ThemeProvider";

type ExamCardProps = {
  questionnaire: QuestionItem[];
  onSubmit: (questionnaire: QuestionItem[]) => void;
  onChange: React.Dispatch<React.SetStateAction<QuestionItem[]>>;
};

const ExamCard = ({ questionnaire, onSubmit, onChange }: ExamCardProps) => {
  // TODO: Implement time
  const [time, setTime] = useState(60 * 10);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const { theme } = useContext(ThemeProviderContext);

  useEffect(() => {
    const interval = setInterval(() => {
      if (time <= 0) {
        // onSubmit(questionnaire);
        clearInterval(interval);
      }
      setTime((prev) => (prev - 1 > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [onSubmit, questionnaire, time]);

  const renderTimeRemaining = () => {
    return `${Math.floor(time / 60)}:${
      time - Math.floor(time / 60) * 60 < 10
        ? `0${time - Math.floor(time / 60) * 60}`
        : time - Math.floor(time / 60) * 60
    }`;
  };

  return (
    <Card className="w-full max-w-5xl p-8 relative -top-8">
      <div className="flex justify-between items-center mb-6">
        <div className="flex items-center space-x-2">
          {theme === "dark" ? (
            <HourglassIcon className="h-8 w-16 animate-spin text-muted-foreground" />
          ) : (
            <Lottie animationData={Timer} className="h-16 " />
          )}

          <div>
            <p className="text-sm text-muted-foreground">Time remaining:</p>
            <p className="text-xl font-bold">{renderTimeRemaining()}</p>
          </div>
        </div>
        <Button
          className="bg-green-500 text-white"
          onClick={() => onSubmit(questionnaire)}
        >
          Submit
        </Button>
      </div>

      <div className="mb-6">
        <h2 className="text-xl font-bold mb-2">
          Question {currentQuestionIndex + 1}:
        </h2>
        <p className="text-lg font-semibold">
          {questionnaire[currentQuestionIndex]?.question}
        </p>
      </div>

      <div className="space-y-5">
        {questionnaire[currentQuestionIndex]?.options.map((option, index) => (
          <div
            key={index}
            className={`flex items-center space-x-2 p-4 border rounded-md border-card-foreground hover:bg-card-foreground hover:text-primary-foreground hover:border-card-foreground transition-colors ${
              questionnaire[currentQuestionIndex].userAnswer === option
                ? "bg-green-600 text-white"
                : ``
            }`}
            onClick={() => {
              onChange((prev) => {
                const newQuestionaire = [...prev];
                newQuestionaire[currentQuestionIndex].userAnswer = option;
                return newQuestionaire;
              });
            }}
          >
            <span className="font-bold">
              {String.fromCharCode(65 + index)}.
            </span>
            <span>{option}</span>
          </div>
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Progress
          value={
            (questionnaire.filter((question) => question.userAnswer).length /
              questionnaire.length) *
            100
          }
          className="w-full"
        />
      </div>

      <div className="flex justify-center mt-5 gap-3">
        {questionnaire.map((_, index) => (
          <Button
            key={index}
            className={`
               ${questionnaire[index].userAnswer && currentQuestionIndex !== index && "bg-green-400 text-primary-foreground"}
                py-2 px-4 rounded-xl hover:bg-blue-400 transition border-2 border-blue-500 
                 ${currentQuestionIndex === index && "bg-blue-400 text-primary-foreground"} `}
            onClick={() => setCurrentQuestionIndex(index)}
          >
            {index + 1}
          </Button>
        ))}
      </div>
    </Card>
  );
};

export default ExamCard;
