import { Message, Room, User } from "./";


type Awaitable<T> = Promise<T> | T;

export interface ClientEvents {
	roomCreate: (room: Room) => Awaitable<void>;
	roomDelete: (room: Room) => Awaitable<void>;
	createMessage: (message: Omit<Message, "id" | "createdAt">) => Awaitable<void>;
	deleteMessage: (message: Message) => Awaitable<void>;
	requestClientData: (clientId: string) => Awaitable<void>;
	requestAllRooms: () => Awaitable<void>;
	requestAllRoomMessages: (roomId: string) => Awaitable<void>;
	requestAllUsers: () => Awaitable<void>;
}

export interface ServerEvents {
	createdMessage: (message: Message) => Awaitable<void>;
	deletedMessage: (message: Message) => Awaitable<void>;
	sentClientData: (client: User) => Awaitable<void>;
	sentAllRooms: (rooms: Room[]) => Awaitable<void>;
	sentAllRoomMessages: (messages: Message[]) => Awaitable<void>;
	sentAllUsers: (users: User[]) => Awaitable<void>;
}
