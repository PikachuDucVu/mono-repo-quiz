import { useState } from "react";
import { NormalScreen } from "../components/NormalScreen";
import Header from "./Header";

const HomeScreen = () => {
  const [loading, setLoading] = useState(false);

  const handleStartQuiz = () => {
    // Do something
  };

  return (
    <NormalScreen embedded disableDefaultBackground>
      <Header />

      <section
        className="mx-auto mt-12 flex flex-col md:flex-row-reverse justify-between items-center px-5 lg:px-10 "
        id="rulesContainer"
      >
        <div className="w-full">
          <img src="banner.png" alt="banner" className="w-full mx-auto" />
        </div>

        <div className="w-full">
          <h1 className="my-8 lg:text-4xl text-3xl md:w-4/6 font-medium text-[#333] lg:leading-normal leading-normal mb-3">
            Learn new concepts for each question
          </h1>
          <p className="border-l-4 pl-2 py-2 mb-6 text-gray-500">
            We help you prepare for exams and quizzes{" "}
          </p>
          <div className="flex  items-center">
            <button
              onClick={handleStartQuiz}
              className={`bg-[#FCC822] px-6 py-2 text-white rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
              id="startQuiz"
              type="button"
            >
              {loading ? "Loading..." : "Start Quiz"}
            </button>

            <button
              className="px-6 py-2 text-[#FCC822] hover:bg-[#FCC822] hover:text-white rounded inline-flex ml-3 transition-all duration-300"
              type="button"
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m8.25 4.5 7.5 7.5-7.5 7.5"
                />
              </svg>
              Know more
            </button>
          </div>
        </div>
      </section>
    </NormalScreen>
  );
};

export default HomeScreen;
