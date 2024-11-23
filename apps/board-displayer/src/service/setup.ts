import axios from "axios";
import { WebSocket } from "partysocket";
import { eventEmitter } from "../utils/emitter";

export class SetupHelper {
  private setupHandler?: (token: string) => void;
  private ws: WebSocket;
  constructor(boardId: string) {
    const url = import.meta.env.VITE_API_WS_URL + "/board/setup?id=" + boardId;
    this.ws = new WebSocket(url);
    this.ws.addEventListener("message", (event) => {
      const data = JSON.parse(event.data);
      if (data.token) {
        this.setupHandler?.(data.token);
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
  setSetupHandler(handler: (token: string) => void) {
    this.setupHandler = handler;
    return this;
  }
  cancel() {
    this.ws.close();
  }
}

export const getBoardStatus = async (boardId: string): Promise<boolean> => {
  const url = import.meta.env.VITE_API_URL + "/board/api/setup-status";
  try {
    const res = await axios.post(url, { id: boardId });
    if (res.status === 200) {
      return res.data.exists;
    }
    return false;
  } catch {
    return false;
  }
};

export const getSetupToken = async (boardId: string) => {
  const url = import.meta.env.VITE_API_URL + "/board/api/setup-token";
  try {
    const res = await axios.post(url, { id: boardId });
    if (res.status === 200) {
      return res.data.token;
    }
    return "";
  } catch {
    return "";
  }
};

export const authorizeSetup = async (boardId: string) => {
  const url = import.meta.env.VITE_API_URL + "/board/api/setup";
  try {
    const res = await axios.post(
      url,
      { id: boardId },
      {
        headers: {
          "Content-Type": "application/json",
        },
        auth: {
          username: "admin",
          password: prompt("Enter admin password", "") || "",
        },
      }
    );
    if (res.status === 200) {
      return true;
    }
    return false;
  } catch {
    return false;
  }
};
