import { useCallback, useEffect, useState } from "react";
import QRCode from "react-qr-code";
import { v4 as uuid } from "uuid";
import { getSetupToken, SetupHelper } from "../../service/setup";

export const SetUpPrompt = ({
  onSetup,
}: {
  onSetup: (token: string) => void;
}) => {
  const [boardId, setBoardId] = useState<string | undefined>("");

  const getToken = useCallback(async () => {
    if (!boardId) {
      return;
    }
    return await getSetupToken(boardId);
  }, [boardId]);

  useEffect(() => {
    let id = localStorage.getItem("id");
    if (!id) {
      id = uuid();
      localStorage.setItem("id", id);
    }
    setBoardId(id);
  }, []);

  useEffect(() => {
    if (!boardId) {
      return;
    }

    const setupHelper = new SetupHelper(boardId);

    setupHelper.setSetupHandler((token: string) => {
      localStorage.removeItem("id");
      onSetup(token);
    });
    return () => {
      setupHelper.cancel();
    };
  }, [boardId, onSetup, getToken]);

  if (!boardId) {
    return <div className="bg-gray-950 text-white">Loading...</div>;
  }
  return (
    <div className="w-full h-full flex flex-col justify-center items-center gap-5">
      <h1 className="font-semibold text-xl uppercase">
        This board is not set up yet.
      </h1>
      <div
        className="p-5 bg-white"
        onClick={() => {
          window.open(
            import.meta.env.VITE_BOARD_SETUP_URL + "/setup/" + boardId,
            "_blank"
          );
        }}
      >
        <QRCode
          value={import.meta.env.VITE_BOARD_SETUP_URL + "/setup/" + boardId}
        />
      </div>
    </div>
  );
};
