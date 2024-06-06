import { QuestionItem, QuestionWithCorrectAnswer } from "../utils/types";
import { CommonButton } from "./common/CommonButton";
import { MultilineTextInput } from "./common/MultilineTextInput";
import { FaHeart } from "react-icons/fa";
import { IoMdRemoveCircle } from "react-icons/io";

const InteractiveQuestionnaire = ({
  question,
  index,
  updateQuestion,
  addOption,
  removeOption,
  updateOption,
  updateCorrectAnswer,
}: {
  question: QuestionWithCorrectAnswer;
  index: number;
  updateQuestion: (value: string) => void;
  addOption: () => void;
  removeOption: (index: number) => void;
  updateOption: (index: number, value: string) => void;
  updateCorrectAnswer: (value: string) => void;
}) => {
  return (
    <>
      <div className="flex flex-col w-full h-full gap-5">
        <div className="text-2xl font-semibold text-center text-gray-800">
          <MultilineTextInput
            value={question.question}
            className="text-center"
            onChange={(e) => updateQuestion(e.target.value)}
          />
        </div>
        <div className="flex flex-col gap-2">
          {question.options.map((option, i) => (
            <div className="flex gap-3" key={i}>
              <CommonButton
                addon={<FaHeart />}
                onClick={() => {
                  updateCorrectAnswer(option);
                }}
              />
              <MultilineTextInput
                value={option}
                className={`${option === question.correctAnswer && option !== "" && "bg-green-500"} transition ${option === question.correctAnswer && option !== "" && "text-white"}`}
                disableStyles
                onChange={(e) => updateOption(i, e.target.value)}
              />
              <CommonButton
                addon={<IoMdRemoveCircle />}
                onClick={() => {
                  removeOption(i);
                }}
                secondaryStyle
              />
            </div>
          ))}
          <CommonButton text={"Add more answer"} onClick={addOption} />
        </div>
      </div>
    </>
  );
};

export default InteractiveQuestionnaire;
