import { useCallback, useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Pencil, Heart, Trash2, Check } from "lucide-react";
import { Questionnaire, Questions } from "@/utils/types";
import { useLocation, useParams } from "wouter";
import { AppRouterParam } from "@/App";
import { QuizAppAPI } from "@/utils/apis/QuizAppAPI";
import { toast } from "react-toastify";

export default function QuestionnaireEditor() {
  // const [questionnaireName, setQuestionnaireName] =
  //   useState("Topic 1: Quizlet");
  const [isEditingName, setIsEditingName] = useState(false);
  const [questionnaire, setQuestionnaire] = useState<Questionnaire>();
  const [selectedQuestionIndex, setSelectedQuestionIndex] = useState<
    number | null
  >(null);

  const params = useParams<AppRouterParam>();
  const [, navigate] = useLocation();

  const fetchQuestions = useCallback(async () => {
    if (!params.id) {
      setQuestionnaire({
        title: "Topic 1: Quizlet",
        questions: [
          {
            question: "Example Question 1",
            options: ["Paris", "London", "Berlin", "Madrid"],
            correctAnswer: "",
          },
        ],
        level: "Easy",
        tags: [],
      });
      return;
    }

    const data = await QuizAppAPI.getQuestionnaireToEditById(params.id);
    setQuestionnaire(data);
    if (data.questions.length > 0) {
      setSelectedQuestionIndex(0);
    }
  }, [params.id]);

  useEffect(() => {
    fetchQuestions();
  }, [fetchQuestions]);

  const addQuestion = () => {
    const newIndex = questionnaire.questions.length;
    const newQuestion: Questions = {
      question: `New Question ${newIndex + 1}`,
      options: ["Option 1", "Option 2", "Option 3", "Option 4"],
      correctAnswer: "Option 1",
    };
    setQuestionnaire({
      ...questionnaire,
      questions: [...questionnaire.questions, newQuestion],
    });
    setSelectedQuestionIndex(newIndex);
  };

  const addOption = () => {
    if (selectedQuestionIndex === null) return;

    const updatedQuestions = questionnaire.questions.map((q, index) =>
      index === selectedQuestionIndex
        ? {
            ...q,
            options: [...q.options, `Option ${q.options.length + 1}`],
          }
        : q
    );
    setQuestionnaire({ ...questionnaire, questions: updatedQuestions });
  };

  const toggleCorrectAnswer = (optionIndex: number) => {
    if (selectedQuestionIndex === null) return;

    const updatedQuestions = questionnaire.questions.map((q, index) =>
      index === selectedQuestionIndex
        ? { ...q, correctAnswer: q.options[optionIndex] }
        : q
    );
    setQuestionnaire({ ...questionnaire, questions: updatedQuestions });
  };

  const removeOption = (optionIndex: number) => {
    if (selectedQuestionIndex === null) return;

    const updatedQuestions = questionnaire.questions.map((q, index) =>
      index === selectedQuestionIndex
        ? {
            ...q,
            options: q.options.filter((_, i) => i !== optionIndex),
            correctAnswer:
              q.options[optionIndex] === q.correctAnswer ? "" : q.correctAnswer,
          }
        : q
    );
    setQuestionnaire({ ...questionnaire, questions: updatedQuestions });
  };

  const removeQuestion = () => {
    if (selectedQuestionIndex === null) return;

    const updatedQuestions = questionnaire.questions.filter(
      (_, index) => index !== selectedQuestionIndex
    );
    setQuestionnaire({ ...questionnaire, questions: updatedQuestions });
    setSelectedQuestionIndex(null);
  };

  const updateQuestionText = (text: string) => {
    if (selectedQuestionIndex === null) return;

    const updatedQuestions = questionnaire.questions.map((q, index) =>
      index === selectedQuestionIndex ? { ...q, question: text } : q
    );
    setQuestionnaire({ ...questionnaire, questions: updatedQuestions });
  };

  const updateOptionText = (optionIndex: number, text: string) => {
    if (selectedQuestionIndex === null) return;

    const updatedQuestions = questionnaire.questions.map((q, index) =>
      index === selectedQuestionIndex
        ? {
            ...q,
            options: q.options.map((o, i) => (i === optionIndex ? text : o)),
          }
        : q
    );

    if (
      text === "" ||
      questionnaire.questions[selectedQuestionIndex].options.includes(text) ||
      questionnaire.questions[selectedQuestionIndex].options[optionIndex] ===
        questionnaire.questions[selectedQuestionIndex].correctAnswer
    ) {
      updatedQuestions[selectedQuestionIndex].correctAnswer = "";
    }

    setQuestionnaire({ ...questionnaire, questions: updatedQuestions });
  };

  const setQuestionIndex = (index: number) => {
    setSelectedQuestionIndex(index);
  };

  const onSubmit = async () => {
    if (!params.id) {
      const res = await QuizAppAPI.addQuestionnaire(questionnaire);
      toast.success(res);
      navigate("/quizlist");
      return;
    }
    const res = await QuizAppAPI.updateQuestionnaire(params.id, questionnaire);
    toast.success(res);
    navigate("/quizlist");
  };

  const onDeleteQuestionaire = async () => {
    if (!confirm("Are you sure you want to delete this questionnaire?")) return;
    const res = await QuizAppAPI.deleteQuestionnaire(params.id);
    toast.success(res);
    navigate("/quizlist");
  };

  return (
    <div className="flex h-screen bg-[#e6f3f5]">
      {/* TODO: Resizeable Sidebar */}
      <div className="w-80 bg-white p-4 flex flex-col">
        <div className="bg-gray-100 p-4 rounded-lg mb-4">
          <div className="flex justify-between items-center mb-2">
            {isEditingName ? (
              <Input
                value={questionnaire?.title}
                onChange={(e) =>
                  setQuestionnaire({ ...questionnaire, title: e.target.value })
                }
                className="text-lg font-semibold"
                autoFocus
                onBlur={() => setIsEditingName(false)}
                onKeyPress={(e) => {
                  if (e.key === "Enter") {
                    setIsEditingName(false);
                  }
                }}
              />
            ) : (
              <h2 className="text-lg font-semibold truncate ">
                {questionnaire?.title}
              </h2>
            )}
            <Button
              variant="ghost"
              size="icon"
              onClick={() => setIsEditingName(!isEditingName)}
            >
              {isEditingName ? (
                <Check className="h-4 w-4" />
              ) : (
                <Pencil className="h-4 w-4" />
              )}
            </Button>
          </div>
          <h3 className="font-semibold mb-2">Questions</h3>
          {questionnaire?.questions.map((question, index) => (
            <div
              key={index}
              className={`flex justify-between items-center mb-2 p-2 rounded cursor-pointer w-full ${selectedQuestionIndex === index ? "bg-blue-100 " : "hover:bg-gray-200"}`}
              onClick={() => setQuestionIndex(index)}
            >
              <span>
                {index + 1}: {question?.question}
              </span>
              <div className="flex gap-3">
                <Pencil className="w-4 h-4 text-gray-500" />
                <Trash2
                  className="w-4 h-4 text-red-500 hover:bg-red-200"
                  onClick={removeQuestion}
                />
              </div>
            </div>
          ))}
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            onClick={addQuestion}
          >
            Add Question
          </Button>
        </div>
        <div className="mt-auto">
          <h3 className="font-semibold mb-2">Settings</h3>
          <Label htmlFor="tag">Tag:</Label>
          <Input
            id="tag"
            value={questionnaire?.tags.join(",") || ""}
            onChange={(e) => {
              setQuestionnaire((prev) => {
                const newQuestionnaire = { ...prev };
                newQuestionnaire.tags = e.target.value.split(",");
                return newQuestionnaire;
              });
            }}
            className="mb-2"
          />
          <div className="flex w-full flex-wrap ">
            {questionnaire?.tags.map((tag, index) => (
              <span key={index} className="bg-gray-200 p-1 m-1 rounded-md">
                {tag}
              </span>
            ))}
          </div>
          <Label htmlFor="level">Level:</Label>
          <Select
            value={questionnaire?.level}
            onValueChange={(value: "Easy" | "Medium" | "Hard") =>
              setQuestionnaire((prev) => {
                const newQuestionnaire = { ...prev };
                newQuestionnaire.level = value;
                return newQuestionnaire;
              })
            }
          >
            <SelectTrigger id="level">
              <SelectValue placeholder="Select level" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="Easy">Easy</SelectItem>
              <SelectItem value="Medium">Medium</SelectItem>
              <SelectItem value="Hard">Hard</SelectItem>
            </SelectContent>
          </Select>
          <Button
            className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
            onClick={onSubmit}
          >
            Save
          </Button>
          <Button
            className="w-full bg-red-500 hover:bg-red-600 text-white mt-2"
            onClick={onDeleteQuestionaire}
          >
            Delete All
          </Button>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 p-4">
        {selectedQuestionIndex !== null && questionnaire?.questions.length ? (
          <>
            <Input
              value={questionnaire?.questions[selectedQuestionIndex]?.question}
              onChange={(e) => updateQuestionText(e.target.value)}
              className="bg-gray-700 text-white p-5 rounded-lg mb-4 text-xl font-bold text-center"
            />
            {questionnaire?.questions[selectedQuestionIndex]?.options.map(
              (option, index) => (
                <div key={index} className="flex mb-2">
                  <Button
                    variant="outline"
                    className={`mr-2 ${option === questionnaire?.questions[selectedQuestionIndex]?.correctAnswer ? "bg-green-500 text-white" : ""}`}
                    onClick={() => toggleCorrectAnswer(index)}
                  >
                    <Heart className="w-4 h-4" />
                  </Button>
                  <Input
                    value={option}
                    onChange={(e) => updateOptionText(index, e.target.value)}
                    className="flex-1"
                  />
                  <Button
                    variant="outline"
                    className="ml-2 text-red-500 hover:bg-red-100"
                    onClick={() => removeOption(index)}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </div>
              )
            )}
            <Button
              className="w-full bg-blue-600 hover:bg-blue-700 text-white mt-4"
              onClick={addOption}
            >
              Add more option
            </Button>
          </>
        ) : (
          <div className="flex items-center justify-center h-full text-gray-500">
            Select a question to edit or add a new one
          </div>
        )}
      </div>
    </div>
  );
}
