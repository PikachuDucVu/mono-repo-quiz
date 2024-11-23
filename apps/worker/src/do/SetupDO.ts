import { DurableObject } from "cloudflare:workers";
import { Bindings } from "../bindings";
import { saveBoard } from "../service/board.service";
import { getDb } from "../util/db";
import { signJwt } from "../util/jwt";

export class SetupDO extends DurableObject<Bindings> {
  constructor(
    public state: DurableObjectState,
    public env: Bindings
  ) {
    super(state, env);
  }

  async setup(id: string) {
    const token = await signJwt({ id, role: "board" }, this.env.JWT_SECRET);
    const clients = this.state.getWebSockets(id);
    if (clients.length === 0) {
      return false;
    }
    await saveBoard(getDb(this.env.DB), id);
    const client = clients[0];
    client.send(JSON.stringify({ token }));
    return true;
  }

  async fetch(request: Request) {
    const webSocketPair = new WebSocketPair();
    const [client, server] = Object.values(webSocketPair);
    const query = new URL(request.url).searchParams;
    const id = query.get("id");
    if (!id) {
      return new Response("Missing id", { status: 400 });
    }
    this.state.acceptWebSocket(server, [id]);

    return new Response(null, {
      status: 101,
      webSocket: client,
    });
  }
}
