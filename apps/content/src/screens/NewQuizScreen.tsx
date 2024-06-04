import { useState } from "react";
import Header from "../components/Header";
import { NormalScreen } from "../components/NormalScreen";
import InteractiveQuestionnaire from "../components/RenderQuestion";
import { QuizDefinition } from "../utils/types";
import { CommonButton } from "../components/common/CommonButton";
import { IoMdRemoveCircle } from "react-icons/io";
import { useLocation } from "wouter";

const NewQuizScreen = () => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [questions, setQuestions] = useState<QuizDefinition[]>([
    {
      question: "What is the capital of France?",
      options: ["Paris", "Berlin", "London", "Madrid"],
      correctAnswer: "Paris",
    },
    {
      question: "What is the capital of Germany?",
      options: ["Paris", "Berlin", "London", "Madrid"],
      correctAnswer: "Berlin",
    },
    {
      question: "What is the capital of England?",
      options: ["Paris", "Berlin", "London", "Madrid"],
      correctAnswer: "London",
    },
    {
      question: "What is the capital of Spain?",
      options: ["Paris", "Berlin", "London", "Madrid"],
      correctAnswer: "Madrid",
    },
  ]);

  const [, nagivate] = useLocation();

  const addQuestion = () => {
    setQuestions((prev) => [
      ...prev,
      {
        question: "",
        options: [],
        correctAnswer: "",
      },
    ]);
    setCurrentQuestionIndex(questions.length);
  };

  const addOption = () => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[currentQuestionIndex].options.push("");
      return newQuestions;
    });
  };

  const updateQuestion = (value: string) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[currentQuestionIndex].question = value;
      return newQuestions;
    });
  };

  const deleteQuestion = (index: number) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions.splice(index, 1);
      return newQuestions;
    });
  };

  const updateOption = (index: number, value: string) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[currentQuestionIndex].options[index] = value;
      return newQuestions;
    });
  };

  const updateCorrectAnswer = (value: string) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[currentQuestionIndex].correctAnswer = value;
      return newQuestions;
    });
  };

  const removeOption = (index: number) => {
    setQuestions((prev) => {
      const newQuestions = [...prev];
      newQuestions[currentQuestionIndex].options.splice(index, 1);
      return newQuestions;
    });
  };

  const onSubmit = () => {
    console.log(questions);
    nagivate("/admin");
  };

  return (
    <NormalScreen embedded disableDefaultBackground>
      <Header />
      <div className="flex w-full h-full font-medium text-gray-800 ">
        <div className="flex flex-col bg-white w-1/4">
          <div className="text-xl text-center p-3 bg-white">Questions</div>
          <div className="p-3 flex flex-col flex-1 border-b border-gray-200 gap-3">
            {questions.map((q, i) => (
              <div
                className="flex w-full cursor-pointer justify-between gap-2"
                key={i}
              >
                <div
                  className="flex min-w-[80%] flex-1 bg-gray-200 hover:bg-gray-300 p-2 rounded-md items-center justify-between gap-2 cursor-pointer"
                  onClick={() => setCurrentQuestionIndex(i)}
                >
                  <div className="truncate">
                    {i + 1}: {q.question}
                  </div>
                  <div>✏️</div>
                </div>
                <div className="flex items-center p-2 bg-gray-600 text-gray-200 rounded-md">
                  <CommonButton
                    addon={<IoMdRemoveCircle />}
                    onClick={() => {
                      deleteQuestion(i);
                    }}
                    secondaryStyle
                    disableDefaultPadding
                    disableDefaultColor
                  />
                </div>
              </div>
            ))}
            <div className="flex flex-col w-full flex-1 gap-3 justify-between">
              <CommonButton text="Add Question" onClick={addQuestion} />
              <CommonButton text="Save" onClick={onSubmit} />
            </div>
          </div>
        </div>
        <div className="px-5 flex-1 flex flex-col justify-center items-center">
          <InteractiveQuestionnaire
            question={questions[currentQuestionIndex]}
            index={currentQuestionIndex}
            updateQuestion={updateQuestion}
            addOption={addOption}
            removeOption={removeOption}
            updateOption={updateOption}
            updateCorrectAnswer={updateCorrectAnswer}
          />
        </div>
      </div>
    </NormalScreen>
  );
};

export default NewQuizScreen;
