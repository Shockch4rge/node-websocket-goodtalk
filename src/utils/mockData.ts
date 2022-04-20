import { PrismaClient } from "@prisma/client";


export async function createMockData(prisma: PrismaClient) {
	const room1 = await prisma.room.create({
		data: {
			name: "Mock Room 1 Name",
			description: "Mock Room 1 Description",
		},
	});

	// create 2 users
	const user1 = await prisma.user.create({
		data: {
			name: "John Doe",

			rooms: {
				connect: {
					id: room1.id,
				},
			},
		},
	});

	const user2 = await prisma.user.create({
		data: {
			name: "Jane Doe",
			rooms: {
				connect: {
					id: room1.id,
				},
			},
		},
	});

	await prisma.message.createMany({
		data: [
			{
				content: "Mock Room 1 Message 1",
				authorId: user1.id,
				roomId: room1.id,
			},
			{
				content: "Mock Room 1 Message 2",
				authorId: user1.id,
				roomId: room1.id,
			},
			{
				content: "Mock Room 1 Message 3",
				authorId: user2.id,
				roomId: room1.id,
			},
			{
				content: "Mock Room 1 Message 4",
				authorId: user2.id,
				roomId: room1.id,
			},
			{
				content: "Mock Room 1 Message 5",
				authorId: user1.id,
				roomId: room1.id,
			}
		],
	});
}

export async function deleteMockData(prisma: PrismaClient) {
	await prisma.message.deleteMany();

	const rooms = await prisma.room.findMany({});

	for (const room of rooms) {
		await prisma.room.delete({
			where: {
				id: room.id,
			},

			include: {
				messages: true,
				users: true,
			},
		});
	}

	await prisma.user.deleteMany();
}
