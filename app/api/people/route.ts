"use server";

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

// Handle GET requests to fetch all people
export async function GET() {
  const people = await prisma.person.findMany();
  return NextResponse.json(people);
}

// Handle POST requests to add a new person
export async function POST(request: Request) {
  const { name } = await request.json();
  const newPerson = await prisma.person.create({
    data: { name },
  });
  return NextResponse.json(newPerson, { status: 201 });
}

// Handle PUT requests to update a person
export async function PUT(request: Request) {
  const { id, name } = await request.json();
  const updatedPerson = await prisma.person.update({
    where: { id },
    data: { name },
  });
  return NextResponse.json(updatedPerson);
}

// Handle DELETE requests to delete a person
export async function DELETE(request: Request) {
  const { id } = await request.json();
  await prisma.person.delete({
    where: { id },
  });
  return NextResponse.json({ message: 'Person deleted' });
}
