import { DurableObject } from "cloudflare:workers";
import {
  GAME_COUNTDOWN_TO_START,
  MAXIMUM_PLAYERS_PER_GAME,
} from "hublock-shared";
import { Bindings } from "../bindings";
import {
  addPlayerToGame,
  getPlayersByIds,
  markGameAsPlaying,
  removePlayerFromGame,
} from "../service/game.service";
import { getDb } from "../util/db";
import { verifyJwt } from "../util/jwt";

export class LobbyDO extends DurableObject<Bindings> {
  constructor(
    public state: DurableObjectState,
    public env: Bindings
  ) {
    super(state, env);
  }

  private async notifyPlayerChangeToAllBoards(playerList: string[]) {
    const clients = this.state.getWebSockets("board");
    const players = await getPlayersByIds(getDb(this.env.DB), playerList);
    clients.forEach(async (client) => {
      client.send(
        JSON.stringify({
          type: "playersUpdated",
          payload: players,
        })
      );
    });
  }

  private async gameWillStart() {
    const clients = this.state.getWebSockets("board");
    clients.forEach(async (client) => {
      client.send(
        JSON.stringify({
          type: "gameWillStart",
          timestamp: Date.now(),
        })
      );
    });
  }

  private async gameStartCancel() {
    const clients = this.state.getWebSockets("board");
    clients.forEach(async (client) => {
      client.send(
        JSON.stringify({
          type: "gameStartCancel",
          timestamp: Date.now(),
        })
      );
    });
  }

  async initGameDo(gameId: string) {
    const id = this.env.GAME_DURABLE_OBJECT.idFromName(gameId);
    const stub = this.env.GAME_DURABLE_OBJECT.get(id);

    const playerIds = ((await this.state.storage.get("playerIds")) ||
      []) as string[];

    await markGameAsPlaying(getDb(this.env.DB), gameId, playerIds);

    await stub.start(gameId);
  }

  async init(gameId: string) {
    await this.state.storage.put("gameId", gameId);
  }

  async alarm() {
    await this.state.storage.put("started", true);
    const gameId = (await this.state.storage.get("gameId")!) as string;
    await this.initGameDo(gameId);
    const boards = this.state.getWebSockets("board");
    boards.forEach(async (client) => {
      client.send(
        JSON.stringify({
          type: "gameStarted",
          timestamp: Date.now(),
        })
      );
    });
    const players = this.state.getWebSockets("player");
    players.forEach(async (client) => {
      client.send(
        JSON.stringify({
          type: "gameStarted",
          timestamp: Date.now(),
        })
      );
    });
  }

  async handleDisconnect(id: string) {
    const playerIds = ((await this.state.storage.get("playerIds")) ||
      []) as string[];
    if (!playerIds.includes(id)) {
      return false;
    }
    await this.state.storage.deleteAlarm();
    await this.gameStartCancel();

    const playerList = await removePlayerFromGame(this.state.storage, id);
    await this.notifyPlayerChangeToAllBoards(playerList);
    return true;
  }

  async handleReady(id: string) {
    if (await this.state.storage.get("started")) {
      return false;
    }
    const playerIds = ((await this.state.storage.get("playerIds")) ||
      []) as string[];
    if (playerIds.length >= MAXIMUM_PLAYERS_PER_GAME) {
      return false;
    }
    const playerList = await addPlayerToGame(this.state.storage, id);
    await this.notifyPlayerChangeToAllBoards(playerList);
    if (playerList.length === MAXIMUM_PLAYERS_PER_GAME) {
      await this.state.storage.setAlarm(Date.now() + GAME_COUNTDOWN_TO_START);
      await this.gameWillStart();
    }

    console.log("playerList", playerList);

    return true;
  }

  async reset() {
    await this.state.storage.put("playerIds", []);
    await this.state.storage.put("started", false);
    await this.notifyPlayerChangeToAllBoards([]);
    return true;
  }

  webSocketClose(
    ws: WebSocket,
    code: number,
    reason: string,
    wasClean: boolean
  ) {
    const id = ws.deserializeAttachment();
    this.handleDisconnect(id);
  }

  async fetch(request: Request) {
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
    const playerIds = ((await this.state.storage.get("playerIds")) ||
      []) as string[];
    if (payload.role !== "board") {
      this.state.acceptWebSocket(server, [id, "player"]);
    } else {
      this.state.acceptWebSocket(server, [id, "board"]);
      this.notifyPlayerChangeToAllBoards(playerIds);
    }
    server.serializeAttachment(id);
    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }
}
