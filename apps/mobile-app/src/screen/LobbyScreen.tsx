import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { useLocation, useParams } from "wouter";
import { getMyInformation } from "../service/auth.service";
import { GameHelper, sendReady, sendUnready } from "../service/game.service";
import { FaPause, FaPlay } from "react-icons/fa";
import Lottie from "lottie-react";
import LoadingDotsAnim from "../animations/LoadingDots.json";
import { ButtonGlow } from "./PlayerGameScreen/ButtonGlow";

// TODO: handle ws reconnection
export const LobbyScreen = () => {
  const { gameId } = useParams<{ gameId: string }>();
  const [ready, setReady] = useState<boolean>(false);
  const [sendingRequest, setSendingRequest] = useState<boolean>(false);
  const { isPending, data } = useQuery({
    queryKey: ["me"],
    queryFn: getMyInformation,
  });

  const [, navigate] = useLocation();
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/register/" + gameId);
    }
  }, [navigate, gameId]);

  useEffect(() => {
    if (!data) return;
    const gameHelper = new GameHelper(gameId);
    gameHelper
      .setStatusHandler((status) => {
        setReady(status);
      })
      .setGameStartedHandler(() => {
        navigate("/game/" + gameId);
      });
    return () => {
      gameHelper.cancel();
    };
  }, [data, gameId]);

  if (isPending || data === undefined) {
    return (
      <div className="w-full h-full flex justify-center items-center">
        <Lottie animationData={LoadingDotsAnim} loop={true} />
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-center p-5 pb-5">
      <div className="flex justify-center items-end flex-1">
        <div className="p-6 px-3 bg-white rounded-[30px] border-4 border-x-2 border-b-8 border-gray-500 h-fit"></div>
      </div>
      <div className="flex flex-col gap-20 justify-center flex-1 h-[40vh] ">
        {!ready ? (
          <h2 className="text-2xl text-center font-[GothamBold]">
            Bạn có chắc chắn muốn chơi game với tên{" "}
            <span className="font-[GothamBold] text-[#F57EB5]">
              {data.displayName}
            </span>
            ?
          </h2>
        ) : (
          <div className="text-2xl text-center font-[GothamBold] flex flex-col">
            Vui lòng đợi người chơi khác
            <Lottie animationData={LoadingDotsAnim} loop={true} />
          </div>
        )}
      </div>

      <ButtonGlow
        size="w-full h-12 -top-10"
        bgColor="bg-[#F57EB5]"
        glowColor="bg-[#B56386]"
        rounded="rounded-[20px]"
        glowTop="top-3"
        disabled={sendingRequest}
        children={
          <div className="text-2xl font-[GothamBold] text-center flex items-center justify-center gap-5">
            {sendingRequest ? (
              <div className="animate-spin">⌛</div>
            ) : !ready ? (
              <FaPlay className="w-6" />
            ) : (
              <FaPause className="w-6" />
            )}
            {!ready ? "Sẵn sàng" : "Hủy sẵn sàng"}
          </div>
        }
        onClick={async () => {
          if (sendingRequest) return;
          if (!ready) {
            setSendingRequest(true);
            const result = await sendReady(gameId);
            setSendingRequest(false);
            if (result) {
              setReady(true);
            } else {
              // alert("The game is full or the game is already started!!");
              alert("Game đã bắt đầu hoặc đã đủ người chơi!!");
            }
          } else {
            setSendingRequest(true);
            await sendUnready(gameId);
            setSendingRequest(false);
            setReady(false);
          }
        }}
      />
    </div>
  );
};
