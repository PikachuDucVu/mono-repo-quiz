import EventEmitter from "events";
import TypedEmitter from "typed-emitter";

type Events = {
  reconnect: () => void;
};

export const eventEmitter = new EventEmitter() as TypedEmitter<Events>;
