import Header from "../components/Header";
import { NormalScreen } from "../components/NormalScreen";

const ExamScreen = () => {
  return (
    <NormalScreen
      embedded
      disableDefaultBackground
      // className="bg-gradient-to-b from-[#f3f7ec] to-[#bce2e7] "
    >
      <Header />
      <div
        className="flex w-full h-full items-center
        justify-center font-bold text-gray-800"
      >
        1223
      </div>
    </NormalScreen>
  );
};

export default ExamScreen;
