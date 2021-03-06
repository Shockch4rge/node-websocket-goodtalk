import "dotenv/config";

import express from "express";
import { Server } from "socket.io";

import { PrismaClient } from "@prisma/client";

import { ClientEvents, ServerEvents } from "./typings/events";
import { createMockData, deleteMockData } from "./utils/mockData";


const prisma = new PrismaClient({
	// log: ["query", "info", "error", "warn"],
});

async function main() {
	const app = express();
	const PORT = 4000;
	const server = app.listen(PORT, "localhost", () => console.log(`Listening on http://localhost:${PORT}`));
	const io = new Server<ClientEvents, ServerEvents>(server, {
		cors: {
			// url of client
			origin: "http://localhost:3000",
			methods: ["GET", "POST", "PUT"],
			credentials: true,
		},
	});

	// TODO:
	// await createMockData(prisma);
	// await deleteMockData(prisma);

	const allusers = await prisma.user.findMany();
	const allrooms = await prisma.room.findMany();
	const allmessages = await prisma.message.findMany();
	console.log("users", allusers);
	console.log("rooms", allrooms);
	console.log("messages", allmessages);

	io.on("connection", socket => {
		console.log(`${socket.id} connected`);

		socket.on("createMessage", async data => {
			const message = await prisma.message.create({
				data: {
					roomId: data.roomId,
					authorId: data.authorId,
					content: data.content,
				},

				include: {
					author: true,
					room: true,
				},
			});

			socket.emit("createdMessage", message);
		});

		socket.on("requestAllRooms", async () => {
			const rooms = await prisma.room.findMany({
				include: {
					messages: true,
				},
			});

			socket.emit("sentAllRooms", rooms);
		});

		socket.on("requestAllRoomMessages", async roomId => {
			const messages = await prisma.message.findMany({
				where: {
					roomId,
				},
				include: {
					author: true,
				},
			});
			
			socket.emit("sentAllRoomMessages", messages);
		});

		// all rooms with corresponding messages in them
		// requestClientData
		socket.on("requestClientData", async clientId => {
			const client = await prisma.user.findUnique({
				where: {
					id: clientId,
				},
				include: {
					rooms: {
						where: {
							users: {
								some: {
									id: clientId,
								},
							},
						},

						include: {
							messages: true,
						},
					},
				},
				// TODO: false for now
				rejectOnNotFound: false,
			});

			if (client !== null) {
				socket.emit("sentClientData", client);
			}
		});

		socket.on("disconnect", () => {
			console.log(`${socket.id} disconnected.`);
		});
	});
}

main()
	.catch(e => {
		throw e;
	})
	.finally(async () => await prisma.$disconnect());
