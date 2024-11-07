"use client";

import Loader from '@/components/Loader';
import React, { useEffect, useRef, useState } from 'react';
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { IoSearchOutline } from "react-icons/io5";
import Link from 'next/link';

interface Task {
    id: number;
    title: string;
    dueDate?: string | null;
    people: { id: number; name: string }[];
    status: 'Open' | 'In Progress' | 'Closed';
    createdAt: string;
}

const TodosPage = () => {
    const [tasks, setTodos] = useState<Task[]>([]);
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState<'Open' | 'In Progress' | 'Closed'>('Open');
    const [peopleIds, setPeopleIds] = useState<number[]>([]);
    const [people, setPeople] = useState<{ id: number; name: string }[]>([]);
    const [editingTodoId, setEditingTodoId] = useState<number | null>(null);
    const [loader, setLoader] = useState(true);
    const [hoveredTaskId, setHoveredTaskId] = useState<number | null>(null);

    const searchInputRef = useRef<HTMLInputElement>(null);

    const fetchTodos = async () => {
        setLoader(true); // Start loading
        const res = await fetch('/api/tasks');
        const data = await res.json();
        setTodos(data);
        setLoader(false);
    };

    const fetchPeople = async () => {
        const res = await fetch('/api/people');
        const data = await res.json();
        setPeople(data);
    };

    useEffect(() => {
        fetchTodos();
        fetchPeople();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoader(true);

        const url = editingTodoId ? `/api/tasks` : '/api/tasks';
        const method = editingTodoId ? 'PUT' : 'POST';

        await fetch(url, {
            method,
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                id: editingTodoId,
                title,
                dueDate,
                peopleIds,
                status,
            }),
        });

        setTitle('');
        setDueDate('');
        setStatus('Open');
        setPeopleIds([]);
        setEditingTodoId(null);
        fetchTodos();
    };

    const handleDelete = async (id: number) => {
        setLoader(true);
        await fetch('/api/tasks', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });
        fetchTodos();
    };

    const handleEdit = (task: Task) => {
        setEditingTodoId(task.id);
        setTitle(task.title);
        setDueDate(task.dueDate ?? '');
        setStatus(task.status);
        setPeopleIds(task.people.map((person) => person.id));
    };

    const headers = [
        { name: 'Title' },
        { name: 'Due Date' },
        { name: 'Status' },
        { name: 'Assigned' },
        { name: 'Created' },
    ];

    const formatDateTime = (dateString: string) => {
        const date = new Date(dateString);
        const formattedDate = date.toLocaleDateString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
        const formattedTime = date.toLocaleTimeString(undefined, {
            hour: 'numeric',
            minute: '2-digit',
            hour12: true
        });
        return `${formattedDate}`;
    };

    const formatDueDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, {
            weekday: 'short',
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const gridColumnsClass = `grid-cols-${headers.length + 1}`;
    // const gridColumnsClass = `grid-cols-6`;

    return (
        <>
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <h1 className="text-3xl font-semibold">Manage Tasks</h1>
                    <p className='text-gray-600'>Lorem ipsum dolor, sit amet consectetur adipisicing elit. Modi sint, maxime blanditiis architecto vel laborum accusantium harum debitis saepe ratione suscipit molestiae odio iste ullam, numquam molestias obcaecati voluptas iure?</p>
                </div>

                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                        placeholder="Task Title"
                        required
                    />
                    <input
                        type="date"
                        value={dueDate}
                        onChange={(e) => setDueDate(e.target.value)}
                    />
                    <select
                        value={peopleIds.length > 0 ? peopleIds[0] : ''}
                        onChange={(e) => {
                            const selectedId = parseInt(e.target.value, 10);
                            setPeopleIds([selectedId]);
                        }}
                    >
                        <option value="" disabled>Choose People</option>
                        {people.map((person) => (
                            <option key={person.id} value={person.id}>
                                {person.name}
                            </option>
                        ))}
                    </select>
                    <select
                        value={status}
                        onChange={(e) => setStatus(e.target.value as 'Open' | 'In Progress' | 'Closed')}
                        required
                    >
                        <option value="Open">Open</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Closed">Closed</option>
                    </select>

                    <button type="submit">
                        {editingTodoId ? 'Update Task' : 'Add Task'}
                    </button>
                    {editingTodoId && (
                        <button type="button" onClick={() => { setEditingTodoId(null); setTitle(''); setDueDate(''); setStatus('Open'); setPeopleIds([]); }}>
                            Cancel Edit
                        </button>
                    )}
                </form>

                {loader ? (
                    <div className='text-center'>
                        <Loader />
                    </div>
                ) : (
                    <>
                        <div className="flex items-center justify-between max-sm:flex-col max-sm:gap-2">
                            <div
                                className="max-sm:order-2 max-sm:w-full relative flex items-center"
                                onClick={() => searchInputRef.current?.focus()} // Focus on the input when clicking anywhere in the container
                            >
                                <div className="px-4 absolute h-full grid items-center pointer-events-none">
                                    <IoSearchOutline className="size-5 text-gray-600" />
                                </div>
                                <input
                                    type="search"
                                    ref={searchInputRef}
                                    name="searchTask"
                                    className="w-auto max-sm:w-full text-base text-black border border-gray-300 px-10 pe-4 py-2 rounded-lg focus:outline-none focus:border-blue-600"
                                    placeholder="Search tasks by title"
                                />
                            </div>
                            <button className="max-sm:w-full max-sm:order-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex gap-1 items-center justify-center">
                                <AiOutlinePlus className="size-4" />
                                Create task
                            </button>
                        </div>

                        <div className="text-base text-black overflow-x-auto w-full">
                            <div
                                className={`px-2 py-4 grid ${gridColumnsClass} bg-blue-100 border border-gray-300 rounded-t-lg`}
                            >
                                {headers.map((header, index) => (
                                    <div key={index} className="px-2 font-semibold">
                                        <p>{header.name}</p>
                                    </div>
                                ))}
                            </div>

                            <div className="border border-t-0 border-gray-300 rounded-b-lg">
                                {tasks.map((task, index) => (
                                    <div
                                        key={task.id}
                                        className={`px-2 py-3 hover:bg-gray-50 text-gray-600 ${index !== tasks.length - 1 ? 'border-b border-gray-300' : "rounded-b-lg"} items-center grid ${gridColumnsClass}`}
                                        onMouseEnter={() => setHoveredTaskId(task.id)}
                                        onMouseLeave={() => setHoveredTaskId(null)}
                                    >
                                        <div className='px-2'>
                                            <Link href={`/tasks/${task.id}`} className='text-blue-600 hover:text-blue-500'>{task.title}</Link>
                                        </div>
                                        <div className='px-2'><p>{task.dueDate ? formatDueDate(task.dueDate) : 'Not set'}</p></div>
                                        <div className="px-2">
                                            <div className={`w-fit px-3 py-1 rounded-full font-semibold text-sm ${task.status === "Open" && "bg-green-100 text-green-600"} ${task.status === "In Progress" && "bg-yellow-100 text-yellow-600"} ${task.status === "Closed" && "bg-purple-100 text-purple-600"}`}>
                                                <p>{task.status}</p>
                                            </div>
                                        </div>
                                        <div className='px-2'>
                                            <p>{task.people.map((p) => p.name).join(', ')}</p>
                                        </div>
                                        <div className='px-2'><p>{formatDateTime(task.createdAt)}</p></div>
                                        {hoveredTaskId === task.id && (
                                            <div className="px-2 flex items-center gap-4 justify-end">
                                                <button onClick={() => handleEdit(task)}><MdEdit className='size-5 text-gray-600 hover:text-yellow-400' /></button>
                                                <button onClick={() => handleDelete(task.id)}><MdDelete className='size-5 text-gray-600 hover:text-red-400' /></button>
                                            </div>
                                        )}
                                    </div>
                                ))}
                            </div>
                        </div>
                    </>
                )}
            </div>
        </>
    );
};

export default TodosPage;
