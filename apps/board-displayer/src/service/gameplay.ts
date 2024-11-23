import { GameState, Player } from "hublock-shared";
import { axiosInstance } from "../utils/axiosInstance";
import { WebSocket } from "partysocket";
import { eventEmitter } from "../utils/emitter";

export class GameplayHelper {
  private ws: WebSocket;
  constructor(gameId: string) {
    const url =
      import.meta.env.VITE_API_WS_URL +
      `/gameplay/play/${gameId}?token=${localStorage.getItem("token")}`;
    this.ws = new WebSocket(url);
    this.ws.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "update") {
        this.gameStateHandler?.(data.state, data.players);
      }
    });
    let firstTime = true;
    this.ws.addEventListener("open", () => {
      if (firstTime) {
        firstTime = false;
      } else {
        eventEmitter.emit("reconnect");
      }
    });
  }
  gameStateHandler?: (state: GameState, players: Player[]) => void;
  setGameStateHandler(handler: (state: GameState, players: Player[]) => void) {
    this.gameStateHandler = handler;
    return this;
  }

  cancel() {
    this.ws.close();
  }
}

export const resetGame = async (gameId: string): Promise<void> => {
  const response = await axiosInstance.post(
    "/gameplay/api/" + gameId + "/reset"
  );
  return response.data;
};
