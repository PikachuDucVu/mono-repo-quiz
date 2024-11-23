import { DurableObject } from "cloudflare:workers";
import {
  GameState,
  MAX_QUESITONS_GAME,
  Player,
  PlayerQuestion,
  TIME_TO_ANSWER,
  TIME_TO_NEXT_QUESTION,
  WARMUP_TIME,
} from "hublock-shared";
import { Bindings } from "../bindings";
import {
  getPlayerInfosFromDb,
  updateGameStatus,
} from "../service/game.service";
import { getDb } from "../util/db";
import { verifyJwt } from "../util/jwt";

const checkAnswer = (answer: string, correctAnswer: string) => {
  return (
    answer
      .toLowerCase()
      .split("")
      .filter((c) => c !== " ")
      .join("") ===
    correctAnswer
      .toLowerCase()
      .split("")
      .filter((c) => c !== " ")
      .join("")
  );
};

const QUESTIONS: { question: string; answer: string }[] = [
  {
    question: "Loài vật nào ngủ đứng?",
    answer: "Ngựa",
  },
  {
    question: "Cây nào cao nhất thế giới?",
    answer: "Bách",
  },
  {
    question: "Thủ đô của Trung Quốc là gì?",
    answer: "Bắc kinh",
  },
  {
    question: "Đại dương nào lớn nhất?",
    answer: "Thái bình dương",
  },
  {
    question: "Nơi nào nóng nhất trái đất?",
    answer: "Sa mạc",
  },
  {
    question: "Loài hoa nào tượng trưng cho tình yêu?",
    answer: "Hoa hồng",
  },
  {
    question: "Con vật nào sống lâu nhất?",
    answer: "Rùa",
  },
  {
    question: "Ai là tác giả truyện Kiều?",
    answer: "Nguyễn Du",
  },
  {
    question: "Vũ khí của ninja là gì?",
    answer: "Phi tiêu",
  },
  {
    question: "Thủ đô của Hàn Quốc là gì?",
    answer: "Seoul",
  },
  {
    question: "Đâu là loại cây thuốc quý của Việt Nam?",
    answer: "Sâm",
  },
  {
    question: "Màu sắc của máu về tim là gì?",
    answer: "Xanh tím",
  },
  {
    question: "Loài chim nào không bay được?",
    answer: "Đà điểu",
  },
  {
    question: "Đơn vị đo nhiệt độ là gì?",
    answer: "Độ C",
  },
  {
    question: "Hòn đảo lớn nhất thế giới?",
    answer: "Greenland",
  },
  {
    question: "Ai là cha đẻ của thuyết tương đối?",
    answer: "Einstein",
  },
  {
    question: "Dân tộc đông nhất Việt Nam?",
    answer: "Kinh",
  },
  {
    question: "Loài vật nào chạy nhanh nhất?",
    answer: "báo",
  },
  {
    question: "Ai là người đầu tiên lên mặt trăng?",
    answer: "armstrong",
  },
  {
    question: "Nhạc cụ dân tộc nào phổ biến nhất?",
    answer: "đàn bầu",
  },
  {
    question: "Hành tinh nào gần Mặt Trời nhất?",
    answer: "sao thủy",
  },
  {
    question: "Thủ đô của nước Pháp là gì?",
    answer: "paris",
  },
  {
    question: "Con vật nào là chúa sơn lâm?",
    answer: "sư tử",
  },
  {
    question: "Môn thể thao vua là gì?",
    answer: "bóng đá",
  },
  {
    question: "Quốc hoa của Việt Nam là gì?",
    answer: "hoa sen",
  },
  {
    question: "Hành tinh nào được gọi là hành tinh đỏ?",
    answer: "sao hỏa",
  },
  {
    question: "Dụng cụ nào dùng để xem các thiên thể?",
    answer: "kính viễn vọng",
  },
  {
    question: "Loài chim nào bay cao nhất?",
    answer: "đại bàng",
  },
  {
    question: "Ai là người phát minh ra điện thoại?",
    answer: "bell",
  },
  {
    question: "Đâu là vị giác cơ bản đầu tiên?",
    answer: "ngọt",
  },
  {
    question: "Thủ đô của Nhật Bản là gì?",
    answer: "tokyo",
  },
  {
    question: "Loại vitamin nào có trong cam quýt?",
    answer: "vitamin c",
  },
  {
    question: "Con vật nào là biểu tượng của hòa bình?",
    answer: "chim bồ câu",
  },
  {
    question: "Đâu là kim loại quý giá nhất?",
    answer: "bạch kim",
  },
  {
    question: "Thành phố nào được gọi là thành phố sương mù?",
    answer: "london",
  },
  {
    question: "Quả nào được mệnh danh là vua của các loại trái cây?",
    answer: "sầu riêng",
  },
  {
    question: "Ai sáng tạo ra Facebook?",
    answer: "zuckerberg",
  },
  {
    question: "Đâu là ngôn ngữ lập trình phổ biến nhất?",
    answer: "python",
  },
  {
    question: "Châu lục nào rộng nhất thế giới?",
    answer: "châu á",
  },
  {
    question: "Ai phát minh ra bóng đèn điện?",
    answer: "edison",
  },
];

const getRandomQuestion = (): {
  question: string;
  answer: string;
  scrambledAnswer: string;
} => {
  const index = Math.floor(Math.random() * QUESTIONS.length);
  const question = QUESTIONS[index];
  const scrambledAnswer = question.answer
    .split("")
    .filter((c) => c !== " ")
    .sort(() => 0.5 - Math.random())
    .join("");

  return {
    ...question,
    scrambledAnswer,
  };
};

export class GameDO extends DurableObject<Bindings> {
  constructor(
    public state: DurableObjectState,
    public env: Bindings
  ) {
    super(state, env);
  }

  private async getGameId() {
    return (await this.state.storage.get("gameId")!) as string;
  }

  private async getGameState() {
    return (await this.state.storage.get("gameState")!) as GameState;
  }

  private async setGameState(state: GameState) {
    await this.state.storage.put("gameState", state);
  }

  private async setPlayerInfos(playerInfos: Player[]) {
    await this.state.storage.put(
      "playerInfos",
      playerInfos.map((p) => ({
        id: p.id,
        displayName: p.displayName,
        avatarUrl: p.avatarUrl,
        score: p.score || 0,
        correct: p.correct || false,
        isAnswered: p.isAnswered || false,
      }))
    );
  }

  private async getPlayerInfos() {
    return (await this.state.storage.get("playerInfos")!) as Player[];
  }

  public async start(gameId: string, reset = false) {
    if (reset) {
      await this.state.storage.deleteAlarm();
    }
    this.setPlayerInfos(await getPlayerInfosFromDb(getDb(this.env.DB), gameId));
    await this.state.storage.put("gameId", gameId);
    await this.state.storage.put("gameState", {
      currentState: "warmingUp",
      lastStateChangeAt: Date.now(),
      currentQuestionIndex: 0,
      currentQuestion: "",
      currentAnswer: "",
      scrambledAnswer: "",
    } as GameState);
    // wait for a little longer than normal loop
    this.state.storage.setAlarm(Date.now() + WARMUP_TIME);
    await this.sendStateToBoards();
  }

  async alarm() {
    const needUpdate = await this.loop();
    if (needUpdate) {
      await this.sendStateToBoards();
    }
    this.state.storage.setAlarm(Date.now() + 1000);
  }

  private async sendStateToBoards(boardId?: string) {
    const state = await this.getGameState();
    const boards = boardId
      ? this.state.getWebSockets(boardId)
      : this.state.getWebSockets("board");
    const playerInfos = await this.getPlayerInfos();
    boards.forEach(async (client) => {
      client.send(
        JSON.stringify({
          type: "update",
          state:
            state.currentState === "waitForPlayerAnswer"
              ? {
                  ...state,
                  currentAnswer: "",
                }
              : state,
          players: playerInfos,
        })
      );
    });
  }

  private async notifyQuestionTimeoutToPlayers() {
    const players = this.state.getWebSockets("player");
    players.forEach(async (client) => {
      client.send(
        JSON.stringify({
          type: "questionTimeout",
        })
      );
    });
  }

  private async notifyGameFinishedToPAllPlayers(leaderboard: Player[]) {
    const players = this.state.getWebSockets("player");

    players.forEach(async (client) => {
      client.send(
        JSON.stringify({
          type: "gameFinished",
          payload: {
            leaderboard,
            finishedAt: Date.now(),
          },
        })
      );
    });
  }

  private async sendCurrentQuestionToPlayers(playerId?: string) {
    const state = await this.getGameState();
    if (!state.currentQuestion || !state.scrambledAnswer) {
      return;
    }
    const playerQuestion: PlayerQuestion = {
      index: state.currentQuestionIndex + 1,
      question: state.currentQuestion,
      scrambledAnswer: state.scrambledAnswer,
      lastStateChangeAt: state.lastStateChangeAt,
    };
    const players = !playerId
      ? this.state.getWebSockets("player")
      : this.state.getWebSockets(playerId);
    players.forEach(async (client) => {
      client.send(
        JSON.stringify({
          type: "question",
          payload: playerQuestion,
        })
      );
    });
  }

  private async nextQuestion() {
    const state = await this.getGameState();
    const { question, answer, scrambledAnswer } = getRandomQuestion();
    const playersInfos = await this.getPlayerInfos();

    playersInfos.forEach((p) => {
      p.isAnswered = false;
      p.correct = false;
    });

    await this.setPlayerInfos(playersInfos);

    const prevState = state.currentState;

    await this.setGameState({
      currentState: "waitForPlayerAnswer",
      lastStateChangeAt: Date.now(),
      currentQuestionIndex:
        prevState === "warmingUp" ? 0 : state.currentQuestionIndex + 1,
      currentQuestion: question,
      currentAnswer: answer,
      scrambledAnswer,
    });
    await this.sendCurrentQuestionToPlayers();
  }

  private async handleAnswers() {
    const state = await this.getGameState();

    await this.notifyQuestionTimeoutToPlayers();

    const correctAnswer = state.currentAnswer!;
    const playerAnswers = await this.getPlayerAnswers();
    const playerInfos = await this.getPlayerInfos();

    // TODO: different score for submitted time
    for (const playerAnswer of playerAnswers) {
      const playerInfo = playerInfos.find(
        (p) => p.id === playerAnswer.playerId
      );
      if (!playerInfo) continue;

      if (checkAnswer(playerAnswer.answer, correctAnswer)) {
        playerInfo.score =
          (playerInfo.score || 0) +
          TIME_TO_ANSWER / 1000 -
          Math.ceil((playerAnswer.timestamp - state.lastStateChangeAt) / 1000);
        playerInfo.correct = true;
      } else {
        playerInfo.correct = false;
      }
    }

    await this.setPlayerInfos(playerInfos);
    await this.state.storage.put("playerAnswers", []);

    if (state.currentQuestionIndex + 1 >= MAX_QUESITONS_GAME) {
      await this.handleFinishGame();
      return;
    }

    await this.setGameState({
      currentState: "waitForNextQuestion",
      lastStateChangeAt: Date.now(),
      currentQuestion: state.currentQuestion,
      currentQuestionIndex: state.currentQuestionIndex,
      currentAnswer: correctAnswer,
    });
  }

  private async getPlayerAnswers() {
    return ((await this.state.storage.get("playerAnswers")) || []) as {
      playerId: string;
      answer: string;
      timestamp: number;
    }[];
  }

  public async handlePlayerAnswer(playerId: string, answer: string) {
    // TODO: record answer
    const playerAnswers = await this.getPlayerAnswers();
    const playerInfos = await this.getPlayerInfos();
    if (!playerAnswers.find((p) => p.playerId === playerId)) {
      await this.state.storage.put("playerAnswers", [
        ...playerAnswers,
        { playerId, answer, timestamp: Date.now() },
      ]);
    }

    playerInfos.forEach((p) => {
      if (p.id === playerId) {
        p.isAnswered = true;
      }
    });

    await this.setPlayerInfos(playerInfos);
    // set end of question if all players answered
    if (!playerInfos.find((p) => !p.isAnswered)) {
      await this.handleAnswers();
    }

    await this.sendStateToBoards();
  }

  public async handleOpenBox() {
    const state = await this.getGameState();
    if (state.currentState !== "waitForOpenBox") {
      return;
    }

    await this.setGameState({
      currentState: "finished",
      lastStateChangeAt: Date.now(),
      currentQuestion: "",
      currentQuestionIndex: -1,
      winner: state.winner,
    });

    await this.sendStateToBoards();
  }

  private async handleFinishGame(giftPositionBox?: number) {
    await this.state.storage.deleteAlarm();
    const playerInfos = await this.getPlayerInfos();
    //cal max score
    const leaderboard = playerInfos.sort(
      (a, b) => (b.score || 0) - (a.score || 0)
    );
    await this.setPlayerInfos(playerInfos);
    await this.setGameState({
      currentState: "waitForOpenBox",
      lastStateChangeAt: Date.now(),
      currentQuestion: "",
      currentQuestionIndex: -1,
      winner: leaderboard[0],
    });

    await this.sendStateToBoards();
    await this.notifyGameFinishedToPAllPlayers(leaderboard);

    await updateGameStatus(
      getDb(this.env.DB),
      await this.getGameId(),
      "finished"
    );
  }

  private async loop(): Promise<boolean> {
    const state = await this.getGameState();
    let needUpdate = false;
    if (state.currentState === "waitForNextQuestion") {
      needUpdate = Date.now() - state.lastStateChangeAt > TIME_TO_NEXT_QUESTION;
      needUpdate && (await this.nextQuestion());
    } else if (state.currentState === "waitForPlayerAnswer") {
      needUpdate = Date.now() - state.lastStateChangeAt > TIME_TO_ANSWER;
      needUpdate && (await this.handleAnswers());
    } else if (state.currentState === "warmingUp") {
      needUpdate = Date.now() - state.lastStateChangeAt > WARMUP_TIME;
      needUpdate && (await this.nextQuestion());
    }
    return needUpdate;
  }

  async fetch(request: Request) {
    // if ((await this.state.storage.getAlarm()) === null) {
    //   this.state.storage.setAlarm(Date.now() + 1000);
    // }
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);
    const query = new URL(request.url).searchParams;
    const token = query.get("token");
    const payload = await verifyJwt(token, this.env.JWT_SECRET);
    if (!payload) {
      return new Response("Invalid token", { status: 400 });
    }
    const id = payload.id;
    if (!id || typeof id !== "string") {
      return new Response("Missing id", { status: 400 });
    }
    if (payload.role !== "board") {
      this.state.acceptWebSocket(server, [id, "player"]);
      await this.sendCurrentQuestionToPlayers(id);
    } else {
      this.state.acceptWebSocket(server, [id, "board"]);
      await this.sendStateToBoards(id);
    }
    server.serializeAttachment(id);
    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }
}
