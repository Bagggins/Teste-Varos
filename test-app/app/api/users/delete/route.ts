import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
	try {
		const userData = await req.json();
		const users = await prisma.user.delete({
			where: {
				id: userData.id,
			},
		});
		return NextResponse.json(users);
	} catch (error) {
		console.error(error);
		return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
	}
}