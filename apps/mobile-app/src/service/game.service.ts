import { axiosInstance } from "../utils/axiosInstance";

export class GameHelper {
  private ws: WebSocket;
  constructor(gameId: string) {
    const url =
      import.meta.env.VITE_API_WS_URL +
      `/game/lobby?token=${localStorage.getItem("token")}&gameId=${gameId}`;
    this.ws = new WebSocket(url);
    this.ws.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "gameStarted") {
        this.gameStartedHandler?.();
      }
    });
  }

  statusHandler?: (status: boolean) => void;
  setStatusHandler(handler: (status: boolean) => void) {
    this.statusHandler = handler;
    return this;
  }

  gameStartedHandler?: () => void;
  setGameStartedHandler(handler: () => void) {
    this.gameStartedHandler = handler;
    return this;
  }

  cancel() {
    this.ws.close();
  }
}

export const sendReady = async (gameId: string): Promise<boolean> => {
  return await axiosInstance
    .post(`/game/api/lobby/${gameId}/ready`)
    .then((res) => res.data);
};

export const sendUnready = async (gameId: string): Promise<boolean> => {
  return await axiosInstance
    .post(`/game/api/lobby/${gameId}/unready`)
    .then((res) => res.data);
};
