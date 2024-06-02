import Header from "../components/Header";
import { NormalScreen } from "../components/NormalScreen";

const NewQuizScreen = () => {
  return (
    <NormalScreen embedded disableDefaultBackground>
      <Header />
      <div className="flex w-full h-full items-center justify-center font-medium text-gray-800">
        New Quiz Form
      </div>
    </NormalScreen>
  );
};

export default NewQuizScreen;
