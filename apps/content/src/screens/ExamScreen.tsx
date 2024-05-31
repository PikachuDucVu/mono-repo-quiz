import Header from "../components/Header";
import { NormalScreen } from "../components/NormalScreen";
import { CommonButton } from "../components/common/CommonButton";
import Timer from "../animations/Timer.json";
import Lottie from "lottie-react";
import { useEffect, useState } from "react";
import { Questionaire } from "../utils/types";

const ExamScreen = () => {
  const [time, setTime] = useState(60);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questionaire, setQuestionaire] = useState<Questionaire[]>([
    {
      question: "What is the capital of Vietnam1?",
      options: ["1", "Ho Chi Minh", "Da Nang", "Hai Phong"],
    },
    {
      question: "What is the capital of Vietnam2?",
      options: ["2", "Ho Chi Minh", "Da Nang", "Hai Phong"],
    },
    {
      question: "What is the capital of Vietnam3?",
      options: ["3", "Ho Chi Minh", "Da Nang", "Hai Phong"],
    },
    {
      question: "What is the capital of Vietnam4?",
      options: ["4", "Ho Chi Minh", "Da Nang", "Hai Phong"],
    },
  ]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime((prev) => (prev - 1 > 0 ? prev - 1 : 0));
    }, 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  return (
    <NormalScreen
      embedded
      disableDefaultBackground
      className="bg-gradient-to-b from-[#f3f7ec] to-[#bce2e7]"
    >
      <Header />
      <div
        className="flex w-full h-full items-center
        justify-center font-medium text-gray-800"
      >
        <div className="flex flex-col bg-white p-7 rounded-2xl w-[80%] h-[75%] relative -top-8">
          <div
            className="flex w-full justify-between
           items-center "
          >
            <div className="flex gap-2 items-center">
              <Lottie animationData={Timer} className="h-16 " />
              <div className="text-md">
                <div className="font-medium">Time remaining:</div>
                <div className="font-bold text-lg">{`${time}:${time}`}</div>
              </div>
            </div>
            <CommonButton
              text="Submit"
              className="py-2 px-5 rounded-xl bg-green-500 text-white font-bold hover:bg-green-600 transition"
              disableDefaultPadding
              disableDefaultColor
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
                    newQuestionaire[currentQuestionIndex].currentAnswer =
                      option;
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
        </div>
      </div>
    </NormalScreen>
  );
};

export default ExamScreen;
