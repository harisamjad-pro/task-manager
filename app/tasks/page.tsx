"use client";

import Loader from '@/components/ui/Loader';
import React, { useEffect, useRef, useState } from 'react';
import { MdEdit } from "react-icons/md";
import { MdDelete } from "react-icons/md";
import { AiOutlinePlus } from "react-icons/ai";
import { IoCheckmarkCircle, IoSearchOutline } from "react-icons/io5";
import Link from 'next/link';
import { IoMdCheckmark } from "react-icons/io";
import { RxCross2 } from "react-icons/rx";
import { MdCancel } from "react-icons/md";
import Toaster from '@/components/ui/Toaster';
import { createTaskAPI, deleteTaskAPI, readTaskAPI, updateTaskAPI } from '@/services/api/tasks';
import { readPeopleAPI } from '@/services/api/people';
import { ButtonSolid } from '@/components/ui/Button';
import { GrNext } from "react-icons/gr";
import { GrPrevious } from "react-icons/gr";
import { ButtonIconic } from '../../components/ui/Button';

interface Tasks {
    id: number;
    title: string;
    dueDate?: string | null;
    people: { id: number; name: string }[];
    status: 'Open' | 'In Progress' | 'Closed';
    createdAt: string;
}

const TasksPage = () => {
    // useState
    const [tasks, setTasks] = useState<Tasks[]>([]);
    const [title, setTitle] = useState('');
    const [dueDate, setDueDate] = useState('');
    const [status, setStatus] = useState<'Open' | 'In Progress' | 'Closed'>('Open');
    const [peopleIds, setPeopleIds] = useState<number[]>([]);
    const [people, setPeople] = useState<{ id: number; name: string }[]>([]);
    const [updatingTaskId, setUpdatingTaskId] = useState<number | null>(null);
    const [loader, setLoader] = useState(true);
    const [hoveredTaskId, setHoveredTaskId] = useState<number | null>(null);
    const [toggleCreateForm, setToggleCreateForm] = useState(false);
    const [createToaster, setCreateToaster] = useState(false);
    const [updateToaster, setUpdateToaster] = useState(false);
    const [deleteToaster, setDeleteToaster] = useState(false);
    const [failToaster, setFailToaster] = useState(false);
    const [currentPage, setCurrentPage] = useState(1);
    const [searchQuery, setSearchQuery] = useState('');

    // useRef
    const searchInputRef = useRef<HTMLInputElement>(null);
    const formInputRef = useRef<HTMLInputElement>(null);
    const formContainerRef = useRef<HTMLInputElement>(null);
    const successSoundRef = useRef<HTMLAudioElement | null>(null);
    const failedSoundRef = useRef<HTMLAudioElement | null>(null);

    const itemsPerPage = 6;

    const filteredTasks = tasks.filter(task =>
        task.title.toLowerCase().includes(searchQuery?.toLowerCase() || '')
    );

    const totalPages = Math.ceil(filteredTasks.length / itemsPerPage);

    const currentPageTasks = filteredTasks.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

    const noData = filteredTasks.length === 0;

    const isAtFirstPage = currentPage === 1;
    const isAtLastPage = currentPage === totalPages;

    const clearToasters = () => {
        setCreateToaster(false);
        setUpdateToaster(false);
        setDeleteToaster(false);
        setFailToaster(false);
    }

    const fetchTasks = async () => {
        setLoader(true);
        try {
            const data = await readTaskAPI();
            setTasks(data);
        } catch (error) {
            console.error('Error fetching tasks:', error);
        } finally {
            setLoader(false);
        }
    };

    const fetchPeople = async () => {
        try {
            const data = await readPeopleAPI();
            setPeople(data);
        } catch (error) {
            console.log("Error fetching people:", error);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchPeople();

        successSoundRef.current = new Audio('/audio/success.mp3');
        failedSoundRef.current = new Audio('/audio/failed.mp3');
    }, []);

    const clearSounds = () => [successSoundRef, failedSoundRef].forEach(ref => ref.current?.pause() && (ref.current.currentTime = 0));

    useEffect(() => {
        if (toggleCreateForm && formInputRef.current) formInputRef.current.focus();
    }, [toggleCreateForm]);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (formContainerRef.current && !formContainerRef.current.contains(event.target as Node)) {
                setToggleCreateForm(false);
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const clearInputs = () => {
        setTitle('');
        setDueDate('');
        setStatus('Open');
        setPeopleIds([]);
        setUpdatingTaskId(null);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoader(true);
        clearToasters();
        clearSounds();

        const taskData = { title, dueDate, peopleIds, status, };

        try {
            if (updatingTaskId) {
                await updateTaskAPI({ ...taskData, id: updatingTaskId });
                setUpdateToaster(true);
            } else {
                await createTaskAPI(taskData);
                setCreateToaster(true);
            }

            clearInputs();
            fetchTasks();
            setToggleCreateForm(false);

            if (successSoundRef.current) successSoundRef.current.play();
        } catch (error) {
            console.error('Error submitting task:', error);
            setFailToaster(true);

            if (failedSoundRef.current) failedSoundRef.current.play();
        } finally {
            setLoader(false);

            setTimeout(() => {
                setCreateToaster(false);
                setUpdateToaster(false);
                setFailToaster(false);
            }, 3000);
        }
    };

    const handleDelete = async (id: number) => {
        setLoader(true);
        clearToasters();
        clearSounds();
        try {
            await deleteTaskAPI(id);
            fetchTasks();
            setDeleteToaster(true);
            if (successSoundRef.current) successSoundRef.current.play();
        } catch (error) {
            console.log(error);
            setFailToaster(true);
            if (failedSoundRef.current) failedSoundRef.current.play();
        } finally {
            setLoader(false);
            setTimeout(() => {
                setDeleteToaster(false);
                setFailToaster(false);
            }, 3000);
        }
    };

    const handleUpdate = (task: Tasks) => {
        setUpdatingTaskId(task.id);
        setTitle(task.title);
        setDueDate(task.dueDate ?? '');
        setStatus(task.status);
        setPeopleIds(task.people.map((person) => person.id));
    };

    const headers = [
        { name: 'Title', span: 2 },
        { name: 'Due Date', span: 1 },
        { name: 'Status', span: 1 },
        { name: 'Assigned', span: 2 },
    ];

    const toasters = [
        { condition: createToaster, title: "Tasks Created", icon: <IoCheckmarkCircle className="text-green-600 size-5" /> },
        { condition: updateToaster, title: "Tasks Updated", icon: <IoCheckmarkCircle className="text-green-600 size-5" /> },
        { condition: deleteToaster, title: "Tasks Deleted", icon: <IoCheckmarkCircle className="text-green-600 size-5" /> },
        { condition: failToaster, title: "Operation Failed", icon: <MdCancel className="text-red-600 size-5" /> }
    ];

    const toggleForm = () => {
        setToggleCreateForm(!toggleCreateForm);
        clearInputs();
    }

    const formatDueDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString(undefined, { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
    };

    const gridColumnsClass = `grid-cols-${headers.length + 2}`;

    return (
        <>
            {toasters.map((toast, index) => toast.condition && (<Toaster key={index} title={toast.title} icon={toast.icon} />))}
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <h1 className="text-3xl font-semibold">Manage Tasks</h1>
                    <p className='text-gray-600'>List of tasks to assign and update status.</p>
                </div>

                {/* Table Start */}
                <div className="flex items-center justify-between max-md:flex-col max-md:gap-2">
                    <div
                        className="max-md:order-2 max-md:w-full relative flex items-center"
                        onClick={() => searchInputRef.current && searchInputRef.current.focus()}
                    >
                        <div className="px-4 absolute h-full grid items-center pointer-events-none">
                            <IoSearchOutline className="size-5 text-gray-600" />
                        </div>
                        <input
                            type="search"
                            ref={searchInputRef}
                            name="searchTask"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            className="w-auto max-md:w-full text-base text-black border border-gray-300 px-10 pe-4 py-2 rounded-lg focus:outline-none focus:border-blue-600"
                            placeholder="Search tasks by title"
                        />
                    </div>
                    <ButtonSolid
                        title='Create task'
                        icon={<AiOutlinePlus className="size-4" />}
                        onClick={toggleForm}
                        disabled={false}
                        maxMdWidth={true}
                        type="button"
                    />
                </div>

                <div className="text-base text-black w-full overflow-x-auto">
                    <div className='w-full max-lg:w-[960px] max-md:w-[896px]'>

                        <div className={`px-2 py-4 grid ${gridColumnsClass} bg-blue-100 border border-gray-300 rounded-t-lg`}>
                            {headers.map((header, index) => (
                                // <div key={index} className={`px-2 font-semibold ${index === 0 && "col-span-2"}`}>
                                <div key={index} className={`px-2 font-semibold col-span-${header.span}`}>
                                    <p>{header.name}</p>
                                </div>
                            ))}
                        </div>
                        <div className="border border-t-0 border-gray-300 rounded-b-lg">
                            {toggleCreateForm && (
                                <div ref={formContainerRef}>
                                    <form onSubmit={handleSubmit} className='bg-white grid grid-cols-6 items-center px-4 py-1 border-2 border-blue-600'>
                                        <div className="col-span-2">
                                            <input
                                                ref={formInputRef}
                                                type="text"
                                                value={title}
                                                onChange={(e) => setTitle(e.target.value)}
                                                placeholder="Tasks Title"
                                                required
                                                className='w-full text-base text-black py-2 focus:outline-none'
                                            />
                                        </div>
                                        <div className="px-2">
                                            <input
                                                type="date"
                                                value={dueDate}
                                                onChange={(e) => setDueDate(e.target.value)}
                                                className='py-2 focus:outline-none'
                                            />
                                        </div>
                                        <div className="px-2">
                                            <select
                                                value={status}
                                                onChange={(e) => setStatus(e.target.value as 'Open' | 'In Progress' | 'Closed')}
                                                required
                                                className='w-full text-base text-black py-2 focus:outline-none'
                                            >
                                                <option value="Open">Open</option>
                                                <option value="In Progress">In Progress</option>
                                                <option value="Closed">Closed</option>
                                            </select>
                                        </div>
                                        <div className="px-2">
                                            <select
                                                value={peopleIds.length > 0 ? peopleIds[0] : ''}
                                                onChange={(e) => {
                                                    const selectedId = parseInt(e.target.value, 10);
                                                    setPeopleIds([selectedId]);
                                                }}
                                                className='w-full text-base text-black py-2 focus:outline-none'
                                            >
                                                <option value="" disabled>Choose People</option>
                                                {people.map((person) => (
                                                    <option key={person.id} value={person.id}>
                                                        {person.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>
                                        <div className="flex items-center gap-4 justify-end">
                                            <ButtonIconic
                                                onClick={toggleForm}
                                                icon={<RxCross2 className="size-5 text-red-600 hover:text-red-400" />}
                                                type="button" // Optional but explicit; recommended for non-submit buttons
                                            />

                                            <ButtonIconic
                                                type="submit"
                                                icon={<IoMdCheckmark className="size-5 text-green-600 hover:text-green-400" />}
                                            />
                                        </div>
                                    </form>
                                </div>
                            )}
                            {currentPageTasks.length ? (
                                currentPageTasks.map((task, index) => (
                                    <div
                                        key={task.id}
                                        className={`px-2 py-3 hover:bg-gray-50 text-gray-600 ${index !== currentPageTasks.length - 1 ? 'border-b border-gray-300' : "rounded-b-lg"} items-center grid ${gridColumnsClass}`}
                                        onMouseEnter={() => setHoveredTaskId(task.id)}
                                        onMouseLeave={() => setHoveredTaskId(null)}
                                    >
                                        <div className='px-2 col-span-2'>
                                            <Link href={`/tasks/${task.id}`} className='text-blue-600 hover:text-blue-500'>{task.title}</Link>
                                        </div>
                                        <div className='px-2'><p>{task.dueDate ? formatDueDate(task.dueDate) : '-'}</p></div>
                                        <div className="px-2">
                                            <div className={`w-fit px-3 py-1 rounded-full font-semibold text-sm ${task.status === "Open" && "bg-green-100 text-green-600"} ${task.status === "In Progress" && "bg-yellow-100 text-yellow-600"} ${task.status === "Closed" && "bg-purple-100 text-purple-600"}`}>
                                                <p>{task.status}</p>
                                            </div>
                                        </div>
                                        <div className='px-2'>
                                            <p>{task.people.length ? task.people.map((p) => p.name).join(', ') : "-"}</p>
                                        </div>
                                        {hoveredTaskId === task.id && (
                                            <div className="px-2 flex items-center gap-4 justify-end">
                                                <button onClick={() => { toggleForm(); handleUpdate(task) }}><MdEdit className='size-5 text-gray-600 hover:text-yellow-400' /></button>
                                                <button onClick={() => handleDelete(task.id)}><MdDelete className='size-5 text-gray-600 hover:text-red-400' /></button>
                                            </div>
                                        )}
                                    </div>
                                ))
                            ) : (
                                <>
                                    <div className='text-center px-4 py-3'>
                                        {loader ? (<Loader />) : (<h2 className='text-gray-600 text-base font-normal'>No data</h2>)}
                                    </div>
                                </>
                            )}
                        </div>

                    </div>
                </div>

                {!loader && (
                    <div className='flex items-center gap-4 justify-end'>
                        <p className='text-base text-gray-600'>Page {currentPage} of {totalPages}</p>
                        <ButtonSolid
                            title=''
                            icon={<GrPrevious />}
                            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
                            disabled={isAtFirstPage || noData}
                            maxMdWidth={false}
                            type="button"
                        />

                        <ButtonSolid
                            title=''
                            icon={<GrNext />}
                            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
                            disabled={isAtLastPage || noData}
                            maxMdWidth={false}
                            type="button"
                        />
                    </div>
                )}
                {/* Table End */}

            </div>
        </>
    );
};

export default TasksPage;