import { useState } from "react";
import Header from "../components/Header";
import { NormalScreen } from "../components/NormalScreen";
import Questionaire from "../components/Questionaire";
import { Question } from "../utils/types";
import ShowScore from "../components/ShowScore";
const correctAnswer = ["Hanoi", "Hanoi", "Hanoi", "Hanoi"];

const ExamScreen = () => {
  const [submitted, setSubmitted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);

  const checkAnswer = (questionaire: Question[]) => {
    let score = 0;
    questionaire.forEach((question, index) => {
      if (question.currentAnswer === correctAnswer[index]) {
        score++;
      }
    });
    setTotalScore(score);
    setSubmitted(true);
  };

  return (
    <div
      className="flex w-full h-full items-center
        justify-center font-medium text-gray-800"
    >
      <div className="flex flex-col bg-white p-7 rounded-2xl w-[80%] h-[75%] relative -top-8">
        {!submitted ? (
          <Questionaire onSubmit={checkAnswer} />
        ) : (
          <ShowScore score={totalScore} />
        )}
      </div>
    </div>
  );
};

export default ExamScreen;
