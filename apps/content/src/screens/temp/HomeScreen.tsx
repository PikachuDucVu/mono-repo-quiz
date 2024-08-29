import { useState } from "react";
import { Link } from "wouter";

const HomeScreen = () => {
  const [loading, setLoading] = useState(false);

  const handleStartQuiz = () => {
    // Do something
  };

  return (
    <section
      className="mx-auto flex flex-col md:flex-row-reverse justify-between items-center px-5 lg:px-10 "
      id="rulesContainer"
    >
      <div className="w-full">
        <img src="banner.png" alt="banner" className="w-full mx-auto" />
      </div>

      <div className="w-full">
        <h1 className="my-5 lg:text-5xl text-2xl md:w-5/6 font-medium text-[#333] lg:leading-normal leading-normal mb-3">
          Learn and practice with quizzes
        </h1>
        <p className="border-l-4 pl-2 py-2 mb-6 text-gray-500">
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </p>
        <div className="flex items-center">
          <Link
            to="/admin"
            onClick={handleStartQuiz}
            className={`bg-[#FCC822] px-6 py-2 text-white rounded ${loading ? "opacity-50 cursor-not-allowed" : ""}`}
            id="startQuiz"
            type="button"
          >
            {loading ? "Loading..." : "Start Quiz"}
          </Link>

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
  );
};

export default HomeScreen;
