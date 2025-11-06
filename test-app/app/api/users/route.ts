import prisma from "@/lib/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const users = await prisma.user.findMany();
    return NextResponse.json(users);
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const userData = await req.json();
    
    const newUser = await prisma.user.create({
      data: {
        email: userData.email,
        name: userData.name,
        age: userData.age,
        cpf: userData.cpf,
        cep: userData.cep,
        address: userData.address,
        state: userData.state,
        addon: userData.addon,
        phone: userData.phone, 
        isConsultant: userData.isConsultant,
        clientList: userData.clientList || [],
      },
    });
    
    console.log(userData);
    return NextResponse.json(newUser, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}

export async function UPDATE(req: NextRequest) {
  try {
    const userData = await req.json();
    
    const updateUser = await prisma.user.update({
			where: {
				id: userData.id,
			},
      data: {
        email: userData.email,
        name: userData.name,
        age: userData.age,
        cpf: userData.cpf,
        cep: userData.cep,
        address: userData.address,
        state: userData.state,
        addon: userData.addon,
        phone: userData.phone, 
        isConsultant: userData.isConsultant,
        clientList: userData.clientList || [],
      },
    });
    
    console.log(userData);
    return NextResponse.json(updateUser, { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}