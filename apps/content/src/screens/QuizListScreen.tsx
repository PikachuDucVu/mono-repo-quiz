import Header from "../components/Header";
import { NormalScreen } from "../components/NormalScreen";
import { FaFirstdraft, FaUser } from "react-icons/fa";

const QuizListScreen = () => (
  <NormalScreen embedded disableDefaultBackground className="">
    <Header />
    <div className="flex w-full py-5 px-10 gap-10 bg-slate-200 ">
      <div className="flex flex-col  items-start font-medium gap-3 ">
        <div className="font-bold text-xl">Thư viện của tôi</div>
        <div className="flex items-center gap-2 bg-white w-[250px] rounded-md px-3 py-1 shadow-md">
          <FaUser />
          <div>Duoc tao boi toi</div>
        </div>
        <div className="flex items-center gap-2 w-[250px] rounded-md px-3 py-1 text-gray-600 hover:text-black hover:bg-white hover:shadow-md transition">
          <FaFirstdraft />
          <div>Nhap</div>
        </div>
      </div>

      <div className="flex flex-col items-center font-medium">
        <div>Danh sach</div>
      </div>
    </div>
  </NormalScreen>
);

export default QuizListScreen;
