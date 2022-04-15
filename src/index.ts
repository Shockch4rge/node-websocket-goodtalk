import "dotenv/config";

import express from "express";
import { Server } from "socket.io";

import { PrismaClient } from "@prisma/client";

import { ClientEvents, ServerEvents } from "./typings/events";


const prisma = new PrismaClient({
	log: ["query", "info", "error", "warn"],
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
		},
	});

	io.on("connection", socket => {
		console.log(`${socket.id} connected`);

		socket.on("messageCreate", async message => {
			console.log(`[messageCreate] ID: ${socket.id}`);
			await prisma.message.create({
				data: message,
			});

			socket.emit("messageReceived", message);
		});

		socket.on("messageDelete", async message => {
			console.log(`[messageDelete]: ID: ${socket.id}`);
			await prisma.message.delete({
				where: {
					id: message.id,
				},
			});

			socket.emit("messageDeleted", message);
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
