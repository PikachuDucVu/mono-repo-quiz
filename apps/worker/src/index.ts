import { Hono } from "hono";
import { boardRoute } from "./api/board.route";
import { gameRoute } from "./api/game.route";
import { gameplayRoute } from "./api/gameplay.route";
import { playerRoute } from "./api/player.route";
import { Bindings } from "./bindings";

export { GameDO } from "./do/GameDO";
export { LobbyDO } from "./do/LobbyDO";
export { SetupDO } from "./do/SetupDO";

const app = new Hono<{ Bindings: Bindings }>();

app.route("/board", boardRoute);
app.route("/game", gameRoute);
app.route("/player", playerRoute);
app.route("/gameplay", gameplayRoute);

export default app;
