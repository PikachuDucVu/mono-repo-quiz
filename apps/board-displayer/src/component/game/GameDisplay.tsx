import {
  GameState,
  Player,
  TIME_TO_ANSWER,
  TIME_TO_FINISH,
  TIME_TO_NEXT_QUESTION,
} from "hublock-shared";
import { useCallback, useContext, useEffect, useState } from "react";
import { GameplayHelper } from "../../service/gameplay";
import { Countdown } from "../lobby/Countdown";
import { ASSETS } from "../../utils/assets";
import { cn } from "../../utils/cn";
import { LoadingContext } from "../../context/Loading";
import CongratsAnim from "../../animations/Congrats.json";
import Lottie from "lottie-react";
import { motion } from "framer-motion";
import { sendToDevice } from "../../utils/message";

export const Game = ({
  gameId,
  onGameDone,
}: {
  gameId: string;
  onGameDone: () => void;
}) => {
  const [gameState, setGameState] = useState<GameState>({
    currentState: "warmingUp",
    lastStateChangeAt: -1,
    currentQuestionIndex: -1,
  });
  const [players, setPlayers] = useState<Player[]>([]);
  const [highestScore, setHighestScore] = useState(0);
  const { setLoading } = useContext(LoadingContext);

  useEffect(() => {
    const gameplayHelper = new GameplayHelper(gameId);

    gameplayHelper.setGameStateHandler((state, players) => {
      setPlayers(players);
      setLoading(false);
      setGameState(state);

      if (state.currentState === "finished") {
        console.log("openGift");
        sendToDevice(
          JSON.stringify({
            message: "openGift",
          })
        );
        onGameDone();
      }
    });

    return () => {
      gameplayHelper.cancel();
    };
  }, [gameId, onGameDone, setLoading]);

  const calHighestScore = useCallback(() => {
    if (players.length === 0) {
      return 0;
    }
    players.forEach((player) => {
      if (player.score && player.score > highestScore) {
        setHighestScore(player.score);
      }
    });
    return highestScore;
  }, [highestScore, players]);

  useEffect(() => {
    calHighestScore();
  }, [calHighestScore]);

  if (gameState.currentState === "waitForOpenBox" && gameState.winner) {
    return (
      <div className="w-full h-full flex flex-col items-center bg-black text-white relative">
        <Lottie
          animationData={CongratsAnim}
          loop={true}
          className="absolute pointer-events-none"
        />

        <div className="font-[GothamBold] text-5xl uppercase mt-20">
          Chúc mừng
        </div>

        <div className="bg-gray-400 p-1.5 pt-0 rounded-full pl-[1px] pr-0 mt-10">
          <div className="bg-white rounded-full p-1 pt-0 pr-1">
            {/* // TODO: */}
            <img src={`/avatars/${0}.jpg`} className="w-36 h-36 rounded-full" />
          </div>
        </div>

        <div className="bg-[#F57EB5] w-[60%] p-8 BeVietnamProSemiBold text-center text-4xl mt-5 rounded-lg">
          {gameState.winner.displayName || ""}
        </div>
        <div className="BeVietnamProSemiBold text-2xl bg-white text-black p-5 rounded-lg w-[40%] text-center">
          <div>{gameState.winner.score} điểm</div>
        </div>

        <div className="BeVietnamProSemiBold mt-5 flex items-center gap-1">
          Vui lòng nhận quà trong vòng:
          <span className="underline ">
            <Countdown
              className="BeVietnamProSemiBold"
              format="ss"
              key={gameState.lastStateChangeAt}
              targetTime={gameState.lastStateChangeAt + TIME_TO_FINISH - 1}
              onFinish={() => {
                onGameDone();
              }}
            />
          </span>
        </div>
      </div>
    );
  }

  return (
    <div className="flex w-full h-full bg-white text-black items-center ">
      <div className="flex w-2/3 h-full flex-col justify-between">
        <motion.div
          className="flex-1 h-full p-12 flex flex-col items-center "
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <div className="flex flex-col items-center w-full">
            <div className="flex flex-col items-center justify-center w-2/3 bg-[#F280B1] border-b-4 border-[#B56386] font-[GothamBold] text-xl text-white text-center rounded-full p-3 min-h-14 ">
              {gameState.currentQuestion && (
                <div className=" font-[GothamBold] text-xl w-full">
                  Câu {gameState.currentQuestionIndex + 1}: {""}
                  {gameState.currentQuestion}
                </div>
              )}
            </div>

            <div className="w-16 h-4 relative">
              <div className="w-1 h-4 left-0 top-0 absolute bg-[#ab6281] shadow-inner"></div>
              <div className="w-1 h-4 left-16 top-0 absolute bg-[#ab6281] shadow-inner"></div>
            </div>

            <div
              className={[
                "flex flex-col items-center justify-center relative h-20 border-2 border-b-[7px] rounded-xl border-black p-5 ",
                "w-[75%] text-2xl",
              ].join(" ")}
            >
              {/* <img src={ASSETS.SCRAMBLE_BOX} /> */}
              <div className="BeVietnamProSemiBold flex items-center justify-center w-full h-full text-center">
                {gameState.scrambledAnswer &&
                  gameState.scrambledAnswer
                    .split("")
                    .map((char, index) =>
                      gameState.scrambledAnswer &&
                      index < gameState.scrambledAnswer?.length - 1
                        ? char + " / "
                        : char
                    )}
                {gameState.currentState === "waitForNextQuestion" && (
                  <div>
                    <span>Câu hỏi kế tiếp bắt đầu trong</span>
                    <Countdown
                      className="flex items-center justify-center w-full h-full font-[GothamBold] text-3xl text-[#F57EB5] uppercase"
                      key={gameState.lastStateChangeAt}
                      format="ss"
                      targetTime={
                        gameState.lastStateChangeAt + TIME_TO_NEXT_QUESTION
                      }
                      onFinish={() => {}}
                    />
                  </div>
                )}
                {gameState.currentState === "warmingUp" && (
                  <div>
                    <span>Sẵn sàng !!!</span>
                    {gameState.lastStateChangeAt > 0 && (
                      <Countdown
                        className="flex items-center justify-center w-full h-full font-[GothamBold] text-3xl text-[#F57EB5] uppercase"
                        key={gameState.lastStateChangeAt}
                        format="ss"
                        targetTime={
                          gameState.lastStateChangeAt +
                          TIME_TO_NEXT_QUESTION -
                          1
                        }
                        onFinish={() => {}}
                      />
                    )}
                  </div>
                )}
              </div>
            </div>

            <div className="flex flex-col h-28 w-[50%] p-3 shadow-custom-inset bg-[#F3F3F3]/25 rounded-md items-center mt-5 ">
              {gameState.currentState === "waitForPlayerAnswer" && (
                <div className="font-[GothamBold] text-xl p-2">
                  Hãy trả lời trong vòng
                </div>
              )}

              <div className="font-[GothamBold] text-4xl text-[#F57EB5] uppercase flex w-full h-full">
                {gameState.currentState === "waitForNextQuestion" && (
                  <div className="flex w-full justify-center items-center h-full gap-1 text-center flex-wrap">
                    {gameState.currentAnswer &&
                      gameState.currentAnswer.split("").map((char, index) => (
                        <div className={char !== " " ? "" : "p-1"} key={index}>
                          {char}
                        </div>
                      ))}
                  </div>
                )}
                {gameState.currentState === "waitForPlayerAnswer" && (
                  <Countdown
                    className="flex items-center justify-center w-full h-full"
                    key={gameState.lastStateChangeAt}
                    format="ss"
                    targetTime={gameState.lastStateChangeAt + TIME_TO_ANSWER}
                    onFinish={() => {}}
                  />
                )}
              </div>
            </div>
          </div>
        </motion.div>

        <motion.div
          className="p-5 flex w-full items-center justify-center gap-10 truncate"
          initial={{ opacity: 0, y: 100 }}
          animate={{ opacity: 1, y: 0 }}
        >
          {players.map((player, index) => (
            <div className="flex items-center flex-col gap-3 " key={index}>
              <div className="flex items-end justify-end">
                <div className="bg-gray-500 p-1.5 pt-0 rounded-full pl-[1px] pr-0">
                  <div
                    className={[
                      "bg-white rounded-full p-1 pt-0 pr-1",
                      player.isAnswered ||
                      gameState.currentState === "waitForNextQuestion"
                        ? "opacity-100"
                        : "opacity-35",
                    ].join(" ")}
                  >
                    <img
                      src={`/avatars/${index}.jpg`}
                      className="w-14 h-14 min-w-14 min-h-14 rounded-full"
                    />
                  </div>
                </div>

                {gameState.currentState === "waitForNextQuestion" && (
                  <img
                    src={player.correct ? ASSETS.CORRECT : ASSETS.WRONG}
                    className="w-6 absolute -mr-2"
                  />
                )}
              </div>

              <div className="text-center font-[GothamBold] max-w-16 truncate">
                {player.displayName}
              </div>
            </div>
          ))}
        </motion.div>
      </div>
      <motion.div
        className="w-1/3 border-l bg-black text-white h-full p-3 flex flex-col gap-5"
        initial={{ opacity: 0, x: 100 }}
        animate={{ opacity: 1, x: 0 }}
      >
        <div className="relative -left-5 mt-1 scale-100">
          <img src={ASSETS.RANKING_TITLE_BOX} className="" />
        </div>

        <div className="flex flex-col h-full w-full gap-5">
          {players.map((player, index) => (
            <div className="flex w-full gap-2" key={index}>
              <div className="bg-gray-500 p-1.5 pt-0 rounded-full pl-[1px] pr-0">
                <div className="bg-white rounded-full p-1 pr-1">
                  <img
                    src={`/avatars/${index}.jpg`}
                    className="w-14 h-14 min-w-14 min-h-14 rounded-full"
                  />
                </div>
              </div>

              <div className="flex-1 h-full p-1.5 flex flex-col gap-3 ">
                <div className="flex w-full justify-between BeVietnamProSemiBold text-lg">
                  <div className="max-w-[50%] truncate">
                    {player.displayName}
                  </div>

                  <div>{player.score} điểm</div>
                </div>

                <div className="bg-white h-3 rounded-full w-full">
                  <div
                    style={{
                      width: `${((player.score || 0) * 100) / highestScore}%`,
                    }}
                    className={cn(
                      player.score === 0 ? "bg-white" : "bg-green-500",
                      " h-3 rounded-full transition-all transform duration-700"
                    )}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>
      </motion.div>
    </div>
  );
};
