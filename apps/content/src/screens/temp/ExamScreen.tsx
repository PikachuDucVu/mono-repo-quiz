import { AppRouterParam } from "@/App";
import Questionaire from "@/components/Questionaire";
import ShowScore from "@/components/ShowScore";
import { QuizAppAPI } from "@/utils/apis/QuizAppAPI";
import { QuestionItem } from "@/utils/types";
import { useCallback, useEffect, useState } from "react";

import { useParams } from "wouter";

const ExamScreen = () => {
  const [submitted, setSubmitted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [questionnaire, setQuestionnaire] = useState<QuestionItem[]>([]);

  const params = useParams<AppRouterParam>();

  const onSubmit = async (answerData: QuestionItem[]) => {
    const { score } = await QuizAppAPI.submitAnswer(params.id, answerData);
    setTotalScore(parseInt(score));
    setSubmitted(true);
  };

  const fetchQuestionaire = useCallback(async () => {
    const data = await QuizAppAPI.examQuestionaire(params.id);
    if (!data) {
      return;
    }
    setQuestionnaire(data);
  }, [params.id]);

  useEffect(() => {
    fetchQuestionaire();
  }, [fetchQuestionaire]);

  return (
    <div className="flex w-full h-full items-center justify-center font-medium text-gray-800">
      <div className="flex flex-col bg-white p-7 rounded-2xl w-[80%] h-[75%] relative -top-8">
        {!submitted ? (
          <Questionaire
            questionnaire={questionnaire}
            onSubmit={onSubmit}
            onChange={setQuestionnaire}
          />
        ) : (
          <ShowScore score={totalScore} />
        )}
      </div>
    </div>
  );
};

export default ExamScreen;
