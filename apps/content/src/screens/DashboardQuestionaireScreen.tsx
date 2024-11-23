import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { PuzzleIcon } from "lucide-react";
import { useLocation } from "wouter";
import { AuthContext } from "@/context/authen";
import { Questionnaire, User } from "@/utils/types";
import { useState, useContext, useEffect, useCallback } from "react";
import { QuizAppAPI } from "@/utils/apis/QuizAppAPI";
import { convertIsoTimestampToReadableFormat } from "@/utils/apis/func";
import { LoadingContext } from "@/context/loading";

export function DashboardQuestionaireScreen() {
  const [, navigate] = useLocation();
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const { userInfo } = useContext<{
    userInfo: User;
    isLoggedIn: boolean;
  }>(AuthContext);

  const { setLoading } = useContext(LoadingContext);
  const navigateToCreateNewQuiz = () => {
    navigate(`/quiz/new`);
  };
  const navigateToModifyQuiz = (id: string) => {
    navigate(`/quiz/edit/${id}`);
  };

  const navigateToPlayQuiz = (id: string) => {
    navigate(`/play/${id}`);
  };

  const fetchAllQuestionnaire = useCallback(async () => {
    setLoading(true);

    const data = await QuizAppAPI.getAllQuestionnaires();
    setQuestionnaires(data);

    setLoading(false);
  }, [setLoading]);

  useEffect(() => {
    fetchAllQuestionnaire();
  }, [fetchAllQuestionnaire]);
  return (
    <div className="flex w-full min-h-screen bg-inherit">
      <aside className="w-1/4 p-4 border-r">
        <h2 className="text-lg font-bold">Thư viện bài tập</h2>
        <Button variant="outline" className="w-full mt-4">
          <ListIcon className="w-4 h-4 mr-2" />
          Bài tập được tạo
        </Button>
      </aside>
      <main className="flex-1 p-4">
        <div className="flex justify-between">
          <h2 className="text-lg font-bold">Danh sách bài tập</h2>
          <Button
            className="bg-green-500 text-white"
            onClick={navigateToCreateNewQuiz}
          >
            <PlusIcon className="w-4 h-4 mr-2" />
            Tạo mới
          </Button>
        </div>

        {questionnaires.map((questionnaire) => (
          <Card key={questionnaire._id} className="mt-4">
            <div className="flex items-center p-4">
              <div className="flex items-center justify-center bg-green-500 w-16 h-16 rounded-full">
                <PuzzleIcon className="text-white w-12 h-12" />
              </div>
              <div className="ml-4 flex-1">
                <div className="flex items-center">
                  <Badge variant="default">QUIZ</Badge>
                  <h3 className="ml-2 text-lg font-semibold">
                    {questionnaire.title}
                  </h3>
                </div>
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <ListIcon className="w-4 h-4 mr-1" />
                  {questionnaire.totalQuestions} câu hỏi
                  <BarChartIcon className="w-4 h-4 mx-2" />
                  {questionnaire.level}
                  <UsersIcon className="w-4 h-4 mx-2" />
                  {questionnaire.tags.join(", ")}
                </div>
                <p className="mt-1 text-sm text-muted-foreground">
                  Author: {questionnaire.createdBy.username || ""} · Created:{" "}
                  {convertIsoTimestampToReadableFormat(questionnaire.createdAt)}
                </p>
              </div>
              <div className="flex space-x-2">
                {(userInfo?.role !== "user" ||
                  userInfo?.username ===
                    questionnaire?.createdBy?.username) && (
                  <Button
                    variant="outline"
                    className="bg-yellow-300"
                    onClick={() => {
                      navigateToModifyQuiz(questionnaire._id);
                    }}
                  >
                    <FilePenIcon className="w-4 h-4 mr-2" />
                    Chỉnh sửa
                  </Button>
                )}
                <Button
                  variant="outline"
                  className="bg-blue-300"
                  onClick={() => {}}
                >
                  <ShareIcon className="w-4 h-4 mr-2" />
                  Chia sẻ
                </Button>
                <Button
                  variant="outline"
                  className="bg-green-300"
                  onClick={() => {
                    navigateToPlayQuiz(questionnaire._id);
                  }}
                >
                  <PlayIcon className="w-4 h-4 mr-2" />
                  Chơi
                </Button>

                <Button
                  variant="outline"
                  className="bg-green-300"
                  onClick={() => {
                    navigateToPlayQuiz(questionnaire._id);
                  }}
                >
                  <PlayIcon className="w-4 h-4 mr-2" />
                  Chơi cùng mọi người
                </Button>
              </div>
            </div>
          </Card>
        ))}
      </main>
    </div>
  );
}

function BarChartIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="12" x2="12" y1="20" y2="10" />
      <line x1="18" x2="18" y1="20" y2="4" />
      <line x1="6" x2="6" y1="20" y2="16" />
    </svg>
  );
}

function FilePenIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 22h6a2 2 0 0 0 2-2V7l-5-5H6a2 2 0 0 0-2 2v10" />
      <path d="M14 2v4a2 2 0 0 0 2 2h4" />
      <path d="M10.4 12.6a2 2 0 1 1 3 3L8 21l-4 1 1-4Z" />
    </svg>
  );
}

function ListIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <line x1="8" x2="21" y1="6" y2="6" />
      <line x1="8" x2="21" y1="12" y2="12" />
      <line x1="8" x2="21" y1="18" y2="18" />
      <line x1="3" x2="3.01" y1="6" y2="6" />
      <line x1="3" x2="3.01" y1="12" y2="12" />
      <line x1="3" x2="3.01" y1="18" y2="18" />
    </svg>
  );
}

function PlayIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="6 3 20 12 6 21 6 3" />
    </svg>
  );
}

function PlusIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function ShareIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8" />
      <polyline points="16 6 12 2 8 6" />
      <line x1="12" x2="12" y1="2" y2="15" />
    </svg>
  );
}

function UsersIcon(props) {
  return (
    <svg
      {...props}
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  );
}
