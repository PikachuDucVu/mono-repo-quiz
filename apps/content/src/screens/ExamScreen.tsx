import { QuestionItem } from "@/utils/types";
import { useCallback, useEffect, useState } from "react";
import { AppRouterParam } from "@/App";
import { useParams } from "wouter";
import { QuizAppAPI } from "@/utils/apis/QuizAppAPI";
import ExamCard from "@/components/ExamCard";
import { toast } from "react-toastify";

export function ExamScreen() {
  const [questionnaire, setQuestionnaire] = useState<QuestionItem[]>([]);
  const [totalScore, setTotalScore] = useState(0);
  const [submitted, setSubmitted] = useState(false);

  const params = useParams<AppRouterParam>();
  const questionaireId = params.id;

  const onSubmit = async (answerData: QuestionItem[]) => {
    const { score } = await QuizAppAPI.submitAnswer(params.id, answerData);
    setTotalScore(parseInt(score));
    console.log("score:", score);
    setSubmitted(true);
  };

  const fetchQuestionaire = useCallback(async () => {
    try {
      const data = await QuizAppAPI.examQuestionaire(questionaireId);
      setQuestionnaire(data);
      console.log(data);
    } catch (error) {
      toast.error("Failed to fetch questionaire");
    }
  }, [questionaireId]);

  useEffect(() => {
    fetchQuestionaire();
  }, [fetchQuestionaire]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-gradient-to-b from-green-100 to-blue-100 relative">
      <ExamCard
        questionnaire={questionnaire}
        onSubmit={onSubmit}
        onChange={setQuestionnaire}
      />
    </div>
  );
}
