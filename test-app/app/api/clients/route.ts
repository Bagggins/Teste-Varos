import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany({
		where: {
			isConsultant: {
				contains: "false",
			},
		},
		cacheStrategy: { ttl: 60 },
	});
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function GETbyConsultant(req: NextRequest) {
  try {
		const userData = await req.json();
    const users = await prisma.user.findMany({
		where: {
			id: { in: userData.clientList },
		},
		cacheStrategy: { ttl: 60 },
	});
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

