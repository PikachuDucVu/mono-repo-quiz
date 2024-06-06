import Lottie from "lottie-react";
import { useState, useEffect } from "react";
import { CommonButton } from "./common/CommonButton";
import Timer from "../animations/Timer.json";
import { QuestionItem } from "../utils/types";

const Questionaire = ({
  onSubmit,
}: {
  onSubmit: (questionaire: QuestionItem[]) => void;
}) => {
  const [time, setTime] = useState(125);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionaire, setQuestionaire] = useState<QuestionItem[]>([
    {
      question: "What is the capital of Vietnam1?",
      options: ["Hanoi", "Ho Chi Minh", "Da Nang", "Hai Phong"],
    },
    {
      question: "What is the capital of Vietnam2?",
      options: ["Hanoi", "Ho Chi Minh", "Da Nang", "Hai Phong"],
    },
    {
      question: "What is the capital of Vietnam3?",
      options: ["Hanoi", "Ho Chi Minh", "Da Nang", "Hai Phong"],
    },
    {
      question: "What is the capital of Vietnam4?",
      options: ["Hanoi", "Ho Chi Minh", "Da Nang", "Hai Phong"],
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (time === 0) {
        onSubmit(questionaire);
        clearInterval(interval);
      }
      setTime((prev) => (prev - 1 > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, [onSubmit, questionaire, time]);

  const renderTimeRemaining = () => {
    return `${Math.floor(time / 60)}:${
      time - Math.floor(time / 60) * 60 < 10
        ? `0${time - Math.floor(time / 60) * 60}`
        : time - Math.floor(time / 60) * 60
    }`;
  };

  return (
    <>
      <div
        className="flex w-full justify-between
           items-center "
      >
        <div className="flex gap-2 items-center">
          <Lottie animationData={Timer} className="h-16 " />
          <div className="text-md">
            <div className="font-medium">Time remaining:</div>
            <div className="font-bold text-lg">{renderTimeRemaining()}</div>
          </div>
        </div>
        <CommonButton
          text="Submit"
          className="py-2 px-5 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition"
          disableDefaultPadding
          disableDefaultColor
          onClick={() => onSubmit(questionaire)}
        />
      </div>

      <div className="p-3 mt-2 font-bold text-xl">
        Question {currentQuestionIndex + 1}: <br />{" "}
        {questionaire[currentQuestionIndex].question}
      </div>

      <div className="">
        {questionaire[currentQuestionIndex].options.map((option, index) => (
          <div
            key={index}
            className={`flex gap-3 text-black items-center border-4 
                ${
                  questionaire[currentQuestionIndex].currentAnswer === option
                    ? "bg-gray-600 text-white"
                    : ``
                }
                rounded-md p-3 mt-2 cursor-pointer hover:shadow-lg transition text-md`}
            onClick={() => {
              setQuestionaire((prev) => {
                const newQuestionaire = [...prev];
                newQuestionaire[currentQuestionIndex].currentAnswer = option;
                return newQuestionaire;
              });
            }}
          >
            <CommonButton
              disableDefaultColor
              disableDefaultPadding
              text={`${String.fromCharCode(65 + index)}.`}
            />
            <div>{option}</div>
          </div>
        ))}
      </div>
      <div className="flex flex-1 justify-center items-center w-full gap-5">
        {questionaire.map((_, index) => (
          <CommonButton
            key={index}
            text={`${index + 1}`}
            disableDefaultColor
            disableDefaultPadding
            className={`
                ${questionaire[index].currentAnswer && currentQuestionIndex !== index && "bg-gray-500 text-white"}
                ${currentQuestionIndex === index && "bg-blue-500 text-white"} 
                py-2 px-4 rounded-xl hover:bg-blue-400 transition border-2 border-blue-500 `}
            onClick={() => setCurrentQuestionIndex(index)}
          />
        ))}
      </div>
    </>
  );
};

export default Questionaire;
