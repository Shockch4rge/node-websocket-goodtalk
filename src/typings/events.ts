import { Message, Room } from "./";


type Awaitable<T> = Promise<T> | T;

export interface ClientEvents {
	roomCreate: (room: Room) => Awaitable<void>;
	roomDelete: (room: Room) => Awaitable<void>;
	fetchAllRoomMessages: (room: Room) => Awaitable<void>;
	messageCreate: (message: Message) => Awaitable<void>;
	messageDelete: (message: Message) => Awaitable<void>;
}

export interface ServerEvents {
	messageReceived: (message: Message) => Awaitable<void>;
	messageDeleted: (message: Message) => Awaitable<void>;
	sentAllRoomMessages: (messages: Message[]) => Awaitable<void>;
}
