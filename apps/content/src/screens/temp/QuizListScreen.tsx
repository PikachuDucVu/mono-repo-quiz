import { FaShare, FaUser } from "react-icons/fa";
import { IoIosList } from "react-icons/io";
import { GiLevelEndFlag } from "react-icons/gi";
import { AiOutlineTags } from "react-icons/ai";
import { useLocation } from "wouter";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";
import { CommonButton } from "../../components/common/CommonButton";
import { useContext, useEffect, useState } from "react";
import { QuizAppAPI } from "../../utils/apis/QuizAppAPI";
import { Questionnaire, User } from "../../utils/types";
import { FiEdit } from "react-icons/fi";
import { AuthContext } from "../../context/authen";

const QuizListScreen = () => {
  const [, navigate] = useLocation();
  const [questionnaires, setQuestionnaires] = useState<Questionnaire[]>([]);
  const { userInfo, isLoggedIn } = useContext<{
    userInfo: User;
    isLoggedIn: boolean;
  }>(AuthContext);

  const navigateToCreateNewQuiz = () => {
    navigate(`/admin/quiz/`);
  };
  const navigateToModifyQuiz = (id: string) => {
    navigate(`/admin/quiz/${id}`);
  };

  const navigateToPlayQuiz = (id: string) => {
    navigate(`/play/${id}`);
  };

  const fetchAllQuestionnaire = async () => {
    const data = await QuizAppAPI.getAllQuestionnaires();
    setQuestionnaires(data);
  };

  useEffect(() => {
    fetchAllQuestionnaire();
  }, []);

  return (
    <div className="flex w-full py-5 px-10 gap-10 bg-slate-200 h-full border-t border-gray-300">
      <div className="flex flex-col items-start font-medium gap-3 ">
        <div className="font-bold text-lg">Thư viện bài tập</div>
        <div className="flex items-center gap-3 bg-white w-[250px] rounded-md px-3 py-1 shadow-md">
          <FaUser />
          <div>Bài tập được tạo</div>
        </div>
      </div>

      <div className="flex flex-col font-medium gap-3 w-full">
        <div className="flex w-full justify-between items-start text-md">
          <div className="text-lg">Danh sách</div>
          <CommonButton
            text="Tạo mới"
            className="py-2 px-4 rounded-xl bg-green-600 text-white font-bold hover:bg-green-700 transition"
            disableDefaultPadding
            disableDefaultColor
            onClick={navigateToCreateNewQuiz}
          />
        </div>

        <div className="flex w-full flex-col gap-5">
          {questionnaires.map((exam) => (
            <div
              key={exam._id}
              className="flex gap-5 bg-white rounded-md items-center px-3 py-2 shadow-md w-full cursor-pointer hover:shadow-lg transition hover:bg-slate-100"
            >
              <div>
                <img src="quizIcon.png" className="rounded-lg" />
              </div>
              <div className="flex flex-col gap-3 flex-1 justify-between items-start">
                <div className="font-normal border rounded-xl text-center text-sm min-w-20">
                  QUIZ
                </div>
                <div className="font-bold">{exam?.title}</div>
                <div className="flex font-light gap-3 items-center">
                  <div className="flex items-center text-sm gap-1">
                    <IoIosList size={18} />
                    <div>{exam?.questions.length} câu hỏi</div>
                  </div>
                  <div className="flex gap-1 text-sm items-center">
                    <GiLevelEndFlag />
                    <div>{exam?.level}</div>
                  </div>
                  <div className="flex gap-1 text-sm items-center">
                    <AiOutlineTags />
                    <div>{exam?.tags.join(", ")}</div>
                  </div>
                </div>
                <div className="flex w-full font-thin text-sm items-center justify-between ">
                  <div>
                    Author: {exam.createdBy.username} · {exam.createdAt}
                  </div>
                  <div className="flex gap-3 font-medium items-center">
                    {/* //TODO: Owner of the quiz can modify the quiz */}
                    {userInfo?.isAdmin && (
                      <button
                        onClick={() => {
                          navigateToModifyQuiz(exam._id);
                        }}
                        className="flex items-center gap-1 bg-yellow-200 px-2 py-1 rounded-md hover:bg-yellow-400 transition w-24 justify-center"
                      >
                        <FiEdit />
                        Edit
                      </button>
                    )}
                    <button className="flex items-center gap-1 bg-blue-200 px-2 py-1 rounded-md hover:bg-blue-400 transition w-24 justify-center">
                      <FaShare />
                      Share
                    </button>
                    <div
                      onClick={() => {
                        navigateToPlayQuiz(exam._id);
                      }}
                    >
                      <button
                        className={`flex items-center justify-center ${isLoggedIn ? "bg-green-600 hover:bg-green-700" : "bg-gray-300"} text-white px-2 py-1 rounded-md transition w-24`}
                      >
                        <MdOutlineSubdirectoryArrowRight
                          size={18}
                          className="relative -left-1"
                        />
                        <div className="relative -left-1">Play</div>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
export default QuizListScreen;
