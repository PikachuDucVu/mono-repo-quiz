import { Player, PlayerQuestion } from "hublock-shared";
import { axiosInstance } from "../utils/axiosInstance";

export class GameplayHelper {
  private ws: WebSocket;
  constructor(gameId: string) {
    const url =
      import.meta.env.VITE_API_WS_URL +
      `/gameplay/play/${gameId}?token=${localStorage.getItem("token")}`;
    this.ws = new WebSocket(url);
    this.ws.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.type === "question") {
        this.playerQuestionHandler?.(data.payload);
      } else if (data.type === "questionTimeout") {
        this.questionTimeoutHandler?.();
      } else if (data.type === "gameFinished") {
        this.gameFinishedHandler?.(data.payload);
      }
    });
  }

  gameFinishedHandler?: ({
    finishedAt,
    leaderboard,
  }: {
    finishedAt: number;
    leaderboard: Player[];
  }) => void;
  async setGameFinishedHandler(
    handler: ({
      finishedAt,
      leaderboard,
    }: {
      finishedAt: number;
      leaderboard: Player[];
    }) => void
  ) {
    this.gameFinishedHandler = handler;
    return this;
  }

  questionTimeoutHandler?: () => void;
  setQuestionTimeoutHandler(handler: () => void) {
    this.questionTimeoutHandler = handler;
    return this;
  }

  playerQuestionHandler?: (question: PlayerQuestion) => void;
  setPlayerQuestionHandler(handler: (question: PlayerQuestion) => void) {
    this.playerQuestionHandler = handler;
    return this;
  }

  cancel() {
    this.ws.close();
  }
}

export const submitAnswer = async (gameId: string, answer: string) => {
  return await axiosInstance.post(`/gameplay/api/${gameId}/answer`, {
    answer,
  });
};

export const sendNotiOpenBox = async (gameId: string) => {
  return await axiosInstance.post(`/gameplay/api/openBox`, {
    gameId,
  });
};
