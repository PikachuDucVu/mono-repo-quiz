import { useCallback, useEffect, useState } from "react";
import { CommonButton } from "../components/common/CommonButton";
import { useLocation, useParams } from "wouter";
import { AppRouterParam } from "../App";
import { QuizAppAPI } from "../utils/apis/Questionnaire";
import { Questionnaire } from "../utils/types";
import { IoMdRemoveCircle } from "react-icons/io";
import InteractiveQuestionnaire from "../components/RenderQuestion";
import { MultilineTextInput } from "../components/common/MultilineTextInput";

const NewQuizScreen = () => {
  const [questionnaire, setQuestionnaire] = useState<
    Questionnaire | undefined
  >();
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState<
    number | undefined
  >(undefined);

  const params = useParams<AppRouterParam>();
  const [, nagivate] = useLocation();

  const fetchQuestions = useCallback(async () => {
    const data = await QuizAppAPI.getQuestionnaireById(params.id);
    setQuestionnaire(data);
    if (data.questions.length > 0) {
      setCurrentQuestionIndex(0);
    }
  }, [params.id]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const modifyTitle = (value: string) => {
    if (value.length > 40) return;
    setQuestionnaire((prev) => {
      const newQuestionnaire = { ...prev };
      newQuestionnaire.title = value;
      return newQuestionnaire;
    });
  };

  const addQuestion = () => {
    setQuestionnaire((prev) => {
      const newQuestionnaire = { ...prev };
      newQuestionnaire.questions.push({
        question: "",
        options: [],
        correctAnswer: "",
      });
      return newQuestionnaire;
    });
  };

  const addOption = () => {
    setQuestionnaire((prev) => {
      const newQuestionnaire = { ...prev };
      newQuestionnaire.questions[currentQuestionIndex].options.push("");
      return newQuestionnaire;
    });
  };

  const updateQuestion = (value: string) => {
    setQuestionnaire((prev) => {
      const newQuestionnaire = { ...prev };
      newQuestionnaire.questions[currentQuestionIndex].question = value;
      return newQuestionnaire;
    });
  };

  const deleteQuestion = (index: number) => {
    setQuestionnaire((prev) => {
      const newQuestionnaire = { ...prev };
      newQuestionnaire.questions.splice(index, 1);
      return newQuestionnaire;
    });
    setCurrentQuestionIndex(
      currentQuestionIndex === index
        ? undefined
        : currentQuestionIndex > index
          ? currentQuestionIndex - 1
          : currentQuestionIndex
    );
  };

  const updateOption = (index: number, value: string) => {
    setQuestionnaire((prev) => {
      const newQuestionnaire = { ...prev };
      if (
        newQuestionnaire.questions[currentQuestionIndex].options[index] ===
        newQuestionnaire.questions[currentQuestionIndex].correctAnswer
      ) {
        newQuestionnaire.questions[currentQuestionIndex].correctAnswer = value;
      }
      newQuestionnaire.questions[currentQuestionIndex].options[index] = value;
      return newQuestionnaire;
    });
  };

  const updateCorrectAnswer = (value: string) => {
    setQuestionnaire((prev) => {
      const newQuestionnaire = { ...prev };
      newQuestionnaire.questions[currentQuestionIndex].correctAnswer = value;
      return newQuestionnaire;
    });
  };

  const removeOption = (index: number) => {
    setQuestionnaire((prev) => {
      const newQuestionnaire = { ...prev };
      newQuestionnaire.questions[currentQuestionIndex].options.splice(index, 1);
      return newQuestionnaire;
    });
  };

  const onSubmit = async () => {
    const res = await QuizAppAPI.updateQuestionnaire(params.id, questionnaire);
    alert(res);
    nagivate("/admin");
  };

  return (
    <div className="flex w-full h-full font-medium text-gray-800 ">
      <div className="flex flex-col bg-white w-1/4">
        <MultilineTextInput
          value={questionnaire?.title || ""}
          className="text-center text-xl font-semibold bg-gray-200 border-gray-200"
          disableStyles
          onChange={(e) => {
            modifyTitle(e.target.value);
          }}
        />
        <div className="text-xl text-center p-3 bg-white">Questions</div>
        <div className="p-3 flex flex-col flex-1 border-b border-gray-200 gap-3">
          {questionnaire?.questions.map((q, i) => (
            <div
              className="flex w-full cursor-pointer justify-between gap-2"
              key={i}
            >
              <div
                className={`flex min-w-[80%] flex-1 ${currentQuestionIndex === i ? "bg-gray-400 text-white" : "bg-gray-200"} hover:bg-gray-400 p-2 rounded-md items-center justify-between gap-2 cursor-pointer`}
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
      {currentQuestionIndex !== undefined && (
        <InteractiveQuestionnaire
          question={questionnaire?.questions[currentQuestionIndex]}
          index={currentQuestionIndex}
          updateQuestion={updateQuestion}
          addOption={addOption}
          removeOption={removeOption}
          updateOption={updateOption}
          updateCorrectAnswer={updateCorrectAnswer}
        />
      )}
    </div>
  );
};

export default NewQuizScreen;
