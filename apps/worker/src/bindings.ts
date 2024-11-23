import { GameDO } from "./do/GameDO";
import { LobbyDO } from "./do/LobbyDO";
import { SetupDO } from "./do/SetupDO";

export type Bindings = {
  JWT_SECRET: string;
  SETUP_ADMIN_PASSWORD: string;
  SETUP_DURABLE_OBJECT: DurableObjectNamespace<SetupDO>;
  LOBBY_DURABLE_OBJECT: DurableObjectNamespace<LobbyDO>;
  GAME_DURABLE_OBJECT: DurableObjectNamespace<GameDO>;
  DB: D1Database;
};
