import { useCallback, useEffect, useState } from "react";
import { useRoute } from "wouter";
import { authorizeSetup, getBoardStatus } from "../../service/setup";
import { sendToDevice } from "../../utils/message";

export const SetUpAdmin = () => {
  const [, params] = useRoute("/setup/:id");
  const [state, setState] = useState<"loading" | "authorized" | "unauthorized">(
    "loading"
  );
  const boardId = params?.id || "";

  const checkBoardState = useCallback(() => {
    if (!boardId) {
      return;
    }
    setState("loading");
    getBoardStatus(boardId).then((status) => {
      if (status) {
        setState("authorized");
      } else {
        setState("unauthorized");
      }
    });
  }, [boardId]);

  useEffect(() => {
    checkBoardState();
  }, [checkBoardState]);

  if (state === "loading") {
    return <div className="bg-gray-950 text-white">Loading...</div>;
  }

  if (state === "authorized") {
    return (
      <div className="w-full h-full flex flex-col justify-center items-center gap-5 bg-gray-900 text-white p-10">
        <h1 className="font-semibold text-xl uppercase">
          Setup is already authorized
        </h1>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5 bg-gray-900 text-white p-10">
      <h1 className="font-semibold text-xl uppercase">
        Do you want to authorize the setup of this board?
      </h1>
      <button
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
        onClick={async () => {
          if (!boardId) {
            return;
          }
          const result = await authorizeSetup(boardId);
          if (result) {
            alert("Setup authorized");

            sendToDevice(
              JSON.stringify({
                eventType: "setupAuthorized",
                token: localStorage.getItem("token"),
              })
            );
          } else {
            alert("Setup authorization failed");
          }
          checkBoardState();
        }}
      >
        Yes, authorize
      </button>
    </div>
  );
};
