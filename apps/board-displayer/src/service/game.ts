import { GameAvailabilityStatus, Player } from "hublock-shared";
import { axiosInstance } from "../utils/axiosInstance";
// import PartySocket from "partysocket";
import { WebSocket } from "partysocket";
import { eventEmitter } from "../utils/emitter";

export class GameHelper {
  private playerReadyHandler?: (players: Player[]) => void;
  // private ws: PartySocket;
  private ws: WebSocket;
  constructor(gameId: string) {
    const url =
      import.meta.env.VITE_API_WS_URL +
      `/game/lobby?token=${localStorage.getItem("token")}&gameId=${gameId}`;
    // this.ws = new PartySocket({
    //   host: url,
    // });
    this.ws = new WebSocket(url);
    this.ws.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "playersUpdated") {
        this.playerReadyHandler?.(data.payload);
      } else if (data.type === "gameWillStart") {
        this.gameWillStartHandler?.(data.timestamp);
      } else if (data.type === "gameStarted") {
        this.gameStartedHandler?.();
      } else if (data.type === "gameStartCancel") {
        this.gameStartCancelHandler?.();
      }
    });
    let firstTime = true;
    this.ws.addEventListener("open", () => {
      console.log(firstTime);
      if (firstTime) {
        firstTime = false;
      } else {
        console.log("reconnect");
        eventEmitter.emit("reconnect");
      }
    });
  }

  gameStartedHandler: (() => void) | undefined;
  setGameStartedHandler(handler: () => void) {
    this.gameStartedHandler = handler;
    return this;
  }

  gameStartCancelHandler: (() => void) | undefined;
  setGameStartCancelHandler(handler: () => void) {
    this.gameStartCancelHandler = handler;
    return this;
  }

  gameWillStartHandler: ((timestamp: number) => void) | undefined;
  setGameWillStartHandler(handler: (timestamp: number) => void) {
    this.gameWillStartHandler = handler;
    return this;
  }

  setPlayerReadyHandler(handler: (players: Player[]) => void) {
    this.playerReadyHandler = handler;
    return this;
  }

  cancel() {
    this.ws.close();
  }
}

export const resetGame = async (gameId: string): Promise<void> => {
  const response = await axiosInstance.post(
    "/game/api/lobby/" + gameId + "/reset"
  );
  return response.data;
};

export const getGameAvailabilityStatus =
  async (): Promise<GameAvailabilityStatus> => {
    const response = await axiosInstance.get("/game/api/gameAvailableStatus");

    return response.data;
  };

export const finishGame = async (gameId: string): Promise<void> => {
  const response = await axiosInstance.post("/game/api/finishGame", {
    id: gameId,
  });

  return response.data;
};
