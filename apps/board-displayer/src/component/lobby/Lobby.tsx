import {
  GAME_COUNTDOWN_TO_START,
  GameAvailabilityStatus,
  Player,
} from "hublock-shared";
import { useCallback, useContext, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { GameHelper, getGameAvailabilityStatus } from "../../service/game";
import { Game } from "../game/GameDisplay";
import { Countdown } from "./Countdown";
import { PlayerList } from "./PlayerList";
import { eventEmitter } from "../../utils/emitter";
import { LoadingContext } from "../../context/Loading";
import { motion } from "framer-motion";
import { sendToDevice } from "../../utils/message";
import Lottie from "lottie-react";
import LoadingAnim from "../../animations/LoadingDots.json";

export const Lobby = () => {
  const [gameAvailabilityStatus, setGameAvailabilityStatus] = useState<
    GameAvailabilityStatus | undefined
  >(undefined);
  const [gameWillStart, setGameWillStart] = useState<boolean>(false);
  const [gameStartTime, setGameStartTime] = useState<number>(0);
  const [nextGameTime, setNextGameTime] = useState<number>(0);
  const { setLoading } = useContext(LoadingContext);

  const [players, setPlayers] = useState<Player[]>([]);

  const fetch = useCallback(async () => {
    const status = await getGameAvailabilityStatus();
    if (status.type !== "available") {
      setNextGameTime(Date.now() + status.countdownTime);
    }

    setGameAvailabilityStatus(status);

    setLoading(false);
  }, [setLoading]);

  useEffect(() => {
    eventEmitter.on("reconnect", fetch);
    return () => {
      eventEmitter.off("reconnect", fetch);
    };
  }, [fetch, setLoading]);

  useEffect(() => {
    setGameAvailabilityStatus(undefined);
    fetch();
  }, [fetch]);

  useEffect(() => {
    if (gameAvailabilityStatus?.type === "available") {
      const gameHelper = new GameHelper(gameAvailabilityStatus.currentGameId);

      gameHelper
        .setPlayerReadyHandler((players) => {
          setPlayers(players);
        })
        .setGameWillStartHandler((ts) => {
          setGameStartTime(ts + GAME_COUNTDOWN_TO_START);
          setGameWillStart(true);
        })
        .setGameStartCancelHandler(() => {
          setGameWillStart(false);
          setGameStartTime(0);
        })
        .setGameStartedHandler(() => {
          setLoading(true);
          fetch();
        });

      return () => {
        gameHelper.cancel();
      };
    }
  }, [gameAvailabilityStatus, fetch, setLoading]);

  useEffect(() => {
    if (gameAvailabilityStatus?.type === "unavailable") {
      console.log("message: endgamesession");
      sendToDevice(
        JSON.stringify({
          message: "endGameSession",
        })
      );
    }
  }, [gameAvailabilityStatus]);

  if (!gameAvailabilityStatus) {
    return (
      <div className="w-full h-full flex flex-col text-4xl justify-center items-center bg-white text-black relative">
        <Lottie animationData={LoadingAnim} loop={true} />
      </div>
    );
  }

  if (
    gameAvailabilityStatus.type === "available" &&
    gameAvailabilityStatus.gameStatus === "playing"
  ) {
    return (
      <Game gameId={gameAvailabilityStatus.currentGameId} onGameDone={fetch} />
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5 bg-white text-black relative">
      {gameAvailabilityStatus.type === "unavailable" && (
        <div className="p-10 flex flex-col gap-5 justify-center items-center w-full h-full bg-white">
          <h1 className="font-[GothamBold] text-2xl uppercase text-black">
            Game hiện tại chưa sẵn sàng, bạn hãy quay lại sau
          </h1>
          <div className="bg-gray-800 py-5 p-10 rounded-[20px] relative border-b-8 border-gray-500">
            <img
              src="/assets/VectorTriangle.png"
              className="w-[66px] absolute left-0 top-0"
            />
            <img
              src="/assets/HourGlass.png"
              className="w-[100px] rotate-[5deg] absolute left-[-40px] -top-4"
            />

            <Countdown
              targetTime={nextGameTime}
              onFinish={fetch}
              className="text-4xl text-[#F57EB5] w-[230px] text-center font-[GothamBold]"
            />
          </div>
        </div>
      )}
      {gameAvailabilityStatus.type === "available" && (
        <div className="flex w-full h-full">
          <motion.div
            className="flex flex-col gap-10 justify-center items-center text-center w-2/3 p-10"
            initial={{ opacity: 0, y: 200 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-4xl font-[GothamBold] uppercase">
              Quét{" "}
              <span className="text-[#F57EB5] font-[GothamBold]">QRcode</span>{" "}
              bên dưới <br /> để tham gia
            </h1>
            <div
              className="p-[20px] bg-white relative rounded-[30px] border-4 border-b-8 border-black shadow"
              onClick={() => {
                navigator.clipboard.writeText(
                  import.meta.env.VITE_MOBILE_APP_URL +
                    "/lobby/" +
                    gameAvailabilityStatus.currentGameId
                );
              }}
            >
              <QRCode
                className="h-[240px] w-[240px]"
                value={
                  import.meta.env.VITE_MOBILE_APP_URL +
                  "/lobby/" +
                  gameAvailabilityStatus.currentGameId
                }
              />
              {gameWillStart && (
                <div className="absolute top-0 left-0 w-full h-full flex flex-col gap-2 rounded-[20px] justify-center items-center bg-black/75 text-white p-5">
                  <h1 className="font-[GothamBold] text-2xl">
                    Game sẽ bắt đầu trong vòng
                  </h1>
                  <Countdown
                    targetTime={gameStartTime}
                    onFinish={() => {}}
                    className="text-9xl text-[#F57EB5] text-center font-[GothamBold]"
                    format="ss"
                  />
                </div>
              )}
            </div>
            <h1 className="uppercase text-2xl text-gray-500 font-[GothamMedium]">
              Trò chơi sẽ bắt đầu khi đủ 6 người tham gia
            </h1>
          </motion.div>
          <motion.div
            className="flex flex-col w-1/3 bg-black text-white p-5 gap-5"
            initial={{ opacity: 0, x: 200 }}
            animate={{ opacity: 1, x: 0 }}
          >
            <h1 className="font-[GothamMedium] text-xl uppercase relative -left-10 bg-[#F57EB5] p-3 px-5 w-fit">
              Danh sách người chơi
            </h1>

            <PlayerList players={players} />
          </motion.div>
        </div>
      )}
    </div>
  );
};
