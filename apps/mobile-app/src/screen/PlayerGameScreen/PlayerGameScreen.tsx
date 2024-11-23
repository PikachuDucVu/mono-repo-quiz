import { PlayerQuestion, TIME_TO_ANSWER } from "hublock-shared";
import { useCallback, useEffect, useState } from "react";
import { useParams } from "wouter";
import {
  GameplayHelper,
  sendNotiOpenBox,
  submitAnswer,
} from "../../service/gameplay.mobile.service";
import { FaHourglassHalf } from "react-icons/fa6";
import { Countdown } from "./Countdown";
import { ButtonGlow } from "./ButtonGlow";
import { UnscrambledInput } from "./UnscrambledInput";
import Lottie from "lottie-react";
import LoadingDotsAnim from "../../animations/LoadingDots.json";
import { getMyInformation } from "../../service/auth.service";

export const PlayerGameScreen = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [currentQuestion, setCurrentQuestion] = useState<
    PlayerQuestion | undefined
  >();
  const [answer, setAnswer] = useState<string>("");
  const [gameFinished, setGameFinished] = useState<{
    isFinished: boolean;
    finishedAt: number;
    ranking: number;
  }>({
    isFinished: false,
    finishedAt: Date.now(),
    ranking: 0,
  });
  const [onOpenedBox, setOnOpenedBox] = useState<boolean>(false);

  const handleSubmitAnswer = useCallback((gameId: string, answer: string) => {
    submitAnswer(gameId, answer);
    setAnswer("");
    setCurrentQuestion(undefined);
  }, []);

  useEffect(() => {
    const gameplayHelper = new GameplayHelper(gameId);
    gameplayHelper
      .setPlayerQuestionHandler((question) => {
        setCurrentQuestion(question);
      })
      .setQuestionTimeoutHandler(() => {
        setCurrentQuestion(undefined);
        setAnswer("");
      })
      .setGameFinishedHandler(async ({ finishedAt, leaderboard }) => {
        console.log(leaderboard);

        const userInfo = await getMyInformation();
        const ranking = leaderboard.findIndex(
          (player) => player.id === userInfo.id
        );
        setGameFinished({ isFinished: true, finishedAt, ranking });
        setCurrentQuestion(undefined);
      });

    return () => {
      gameplayHelper.cancel();
    };
  }, [gameId]);

  const handleOpenBox = useCallback(async () => {
    sendNotiOpenBox(gameId);
    setOnOpenedBox(true);
  }, [gameId]);

  if (gameFinished?.isFinished) {
    return (
      <div className="bg-black/75 fixed w-screen h-screen flex flex-col items-center justify-center">
        <div className="text-2xl text-center font-[GothamBold] flex flex-col ">
          <div className="text-xl">
            <div>Trò chơi đã kết thúc !!</div>
            Xếp hạng của bạn
            <div className="text-[#F57EB5]">#{gameFinished.ranking + 1}</div>
          </div>

          {/* //hint close tab  */}
          {gameFinished.ranking + 1 === 1 && !onOpenedBox ? (
            <div className="w-full mt-5 flex flex-col items-center gap-3">
              <div className="text-[#F57EB5] text-xs">
                Nhấn nút bên dưới để nhận quà
              </div>
              <img
                src="/assets/openGift.png"
                className="w-1/3"
                onClick={handleOpenBox}
              />
            </div>
          ) : (
            <div className="text-[#F57EB5] text-xs mt-4 ">
              Bạn đã có thể đóng tab này
            </div>
          )}

          {/* <Countdown
            targetTime={gameFinished.finishedAt + TIME_TO_FINISH}
            format="mm:ss"
            className="text-2xl font-[GothamBold]"
            onFinish={() => {
              navigate(`/lobby/${gameId}`);
            }}
          /> */}
        </div>
      </div>
    );
  }

  if (!currentQuestion?.question) {
    return (
      <div className="bg-black/75 fixed w-screen h-screen flex flex-col items-center justify-center">
        <div className="text-2xl text-center font-[GothamBold] flex flex-col">
          Vui lòng đợi câu hỏi tiếp theo
          <Lottie animationData={LoadingDotsAnim} loop={true} />
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col w-full h-full">
      <div className="p-2 flex justify-center gap-3 items-center bg-pink-400">
        <FaHourglassHalf className="text-2xl font-bold" />
        <Countdown
          targetTime={currentQuestion.lastStateChangeAt + TIME_TO_ANSWER}
          format="mm:ss"
          className="text-2xl font-[GothamBold]"
        />
      </div>
      <div className="flex flex-col w-full flex-1 p-5 pb-5 gap-7">
        <div className="flex flex-col items-center">
          <div className="bg-[#F57EB5] min-w-64 p-3 px-5 rounded-[44px] border-b-4 border-[#B56386] shadow-xl shadow-black">
            <div className="flex items-center justify-center text-lg font-[GothamBold] text-center h-8 text-white leading-tight">
              Câu {currentQuestion.index}: {currentQuestion.question}
            </div>
          </div>
          <div className="w-16 h-4 relative">
            <div className="w-1 h-4 left-0 top-0 absolute bg-[#ab6281] shadow-inner" />
            <div className="w-1 h-4 left-16 top-0 absolute bg-[#ab6281] shadow-inner" />
          </div>
          <div className="w-full h-16 relative items-center">
            <div className="w-full h-16 absolute top-1 left-0 bg-[#F57EB5] rounded-[5px] shadow-inner shadow-white"></div>
            <ButtonGlow
              size="w-[98%] h-16"
              bgColor="bg-white"
              glowColor="bg-[#9D9D9D]"
              rounded="rounded-[10px]"
              glowTop="top-2"
              children={
                <div className="flex items-center justify-center w-full h-full">
                  <p className="p-2.5 w-full text-wrap text-black text-2xl BeVietnamProSemiBold tracking-widest break-words">
                    {currentQuestion.scrambledAnswer
                      .split("")
                      .map((char, index) =>
                        currentQuestion.scrambledAnswer &&
                        index < currentQuestion.scrambledAnswer?.length - 1
                          ? char + "/"
                          : char
                      )}
                  </p>
                </div>
              }
            />
          </div>
        </div>

        <UnscrambledInput
          scrambled={currentQuestion.scrambledAnswer}
          onChange={setAnswer}
        />

        <ButtonGlow
          size="w-full h-12"
          bgColor="bg-[#F57EB5]"
          glowColor="bg-[#B56386]"
          rounded="rounded-[20px]"
          glowTop="top-3"
          children={
            <p className="text-2xl font-[GothamBold] text-center">Hoàn thành</p>
          }
          onClick={() => {
            handleSubmitAnswer(gameId, answer);
          }}
        />
      </div>
    </div>
  );
};
