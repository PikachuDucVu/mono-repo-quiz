import { Player } from "./player";

export type GameAvailabilityStatus =
  | {
      type: "unavailable";
      countdownTime: number;
    }
  | {
      type: "available";
      currentGameId: string;
      gameStatus: "open" | "playing" | "finished";
    };

export type GameState = {
  currentState:
    | "warmingUp"
    | "waitForPlayerAnswer"
    | "waitForNextQuestion"
    | "waitForOpenBox"
    | "finished";
  lastStateChangeAt: number;
  currentQuestionIndex: number;
  currentQuestion?: string;
  currentAnswer?: string;
  scrambledAnswer?: string;
  playerAnswers?: {
    playerId: string;
    correct?: boolean;
  }[];
  winner?: Player;
};

export type PlayerQuestion = {
  index: number;
  question: string;
  scrambledAnswer: string;
  lastStateChangeAt: number;
};
