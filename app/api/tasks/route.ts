"use server"; // Server component

import { NextResponse } from 'next/server';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

export async function GET() {
    const tasks = await prisma.task.findMany({
        include: {
            people: true, // Include related people
        },
    });
    return NextResponse.json(tasks);
}

export async function POST(request: Request) {
    const { title, dueDate, status, peopleIds } = await request.json();
    const newTodo = await prisma.task.create({
        data: {
            title,
            dueDate: dueDate ? new Date(dueDate) : null,
            status,
            people: {
                connect: peopleIds.map((id: number) => ({ id })),
            },
        },
    });
    return NextResponse.json(newTodo, { status: 201 });
}

export async function PUT(request: Request) {
    const { id, title, dueDate, status, peopleIds } = await request.json();
    const updatedTodo = await prisma.task.update({
        where: { id },
        data: {
            title,
            dueDate: dueDate ? new Date(dueDate) : null,
            status,
            people: {
                set: peopleIds.map((id: number) => ({ id })),
            },
        },
    });
    return NextResponse.json(updatedTodo);
}

export async function DELETE(request: Request) {
    const { id } = await request.json();
    await prisma.task.delete({
        where: { id },
    });
    return NextResponse.json({ message: 'Task deleted successfully' });
}
