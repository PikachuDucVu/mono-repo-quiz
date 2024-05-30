import Header from "../components/Header";
import { NormalScreen } from "../components/NormalScreen";
import { FaFirstdraft, FaShare, FaUser } from "react-icons/fa";
import { dummyExamLibraries } from "../utils/dummyData";
import { IoIosList } from "react-icons/io";
import { GiLevelEndFlag } from "react-icons/gi";
import { AiOutlineTags } from "react-icons/ai";
import { Link } from "wouter";
import { MdOutlineSubdirectoryArrowRight } from "react-icons/md";

const QuizListScreen = () => (
  <NormalScreen embedded disableDefaultBackground className="" wFull>
    <Header />
    <div className="flex w-full py-5 px-10 gap-10 bg-slate-200 ">
      <div className="flex flex-col items-start font-medium gap-3 ">
        <div className="font-bold text-xl">Thư viện bài tập</div>
        <div className="flex items-center gap-3 bg-white w-[250px] rounded-md px-3 py-1 shadow-md">
          <FaUser />
          <div>Bài tập được tạo</div>
        </div>
        <div className="flex items-center gap-3 w-[250px] rounded-md px-3 py-1 text-gray-600 hover:text-black hover:bg-white hover:shadow-md transition">
          <FaFirstdraft />
          <div>Nháp</div>
        </div>
      </div>

      <div className="flex flex-col font-medium gap-3 w-full">
        <div className="text-lg">Danh sách</div>
        <div className="flex w-full flex-col gap-5">
          {dummyExamLibraries.map((exam) => (
            <Link
              to={`/admin/quiz/${exam.id}`}
              key={exam.id}
              className="flex gap-5 bg-white rounded-md items-center px-3 py-2 shadow-md w-full cursor-pointer hover:shadow-lg transition hover:bg-slate-100"
            >
              <div>
                <img src="quizIcon.png" className="rounded-lg" />
              </div>
              <div className="flex flex-col gap-3 flex-1 justify-between items-start">
                <div className="font-normal border rounded-xl text-center text-sm min-w-20">
                  QUIZ
                </div>
                <div className="font-bold">{exam.title}</div>
                <div className="flex font-light gap-3 items-center">
                  <div className="flex items-center text-sm gap-1">
                    <IoIosList size={18} />
                    <div>{exam.totalQuestions} câu hỏi</div>
                  </div>
                  <div className="flex gap-1 text-sm items-center">
                    <GiLevelEndFlag />
                    <div>{exam.level}</div>
                  </div>
                  <div className="flex gap-1 text-sm items-center">
                    <AiOutlineTags />
                    <div>{exam.tags.join(", ")}</div>
                  </div>
                </div>
                <div className="flex w-full font-thin text-sm items-center justify-between ">
                  <div>
                    {exam.author} · 7 tháng trước
                    {/* {exam.createdDate} */}
                  </div>
                  <div className="flex gap-3 font-medium items-center">
                    <button className="flex items-center gap-1 bg-blue-200 px-2 py-1 rounded-md hover:bg-blue-400 transition w-24 justify-center">
                      <FaShare />
                      Share
                    </button>
                    <Link href={`/play/${exam.id}`}>
                      <button className="flex items-center justify-center bg-green-600 text-white px-2 py-1 rounded-md hover:bg-green-700 transition w-24">
                        <MdOutlineSubdirectoryArrowRight
                          size={18}
                          className="relative -left-1"
                        />
                        <div className="relative -left-1">Play</div>
                      </button>
                    </Link>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </div>
  </NormalScreen>
);

export default QuizListScreen;
