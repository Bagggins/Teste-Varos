import { NextRequest, NextResponse } from "next/server";
import prisma from "@/lib/prisma";

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json();
    
    // Convert string IDs to numbers
    const clientIds = userData.clientList.map((id: string | number) => 
      typeof id === 'string' ? parseInt(id, 10) : id
    );
    
    const users = await prisma.user.findMany({
      where: {
        id: { in: clientIds },
      },
      cacheStrategy: { ttl: 60 },
    });
    
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}