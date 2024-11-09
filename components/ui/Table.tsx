// components/common/Table.tsx
"use client";

import React, { useRef, useEffect, useState } from "react";
import { IoCheckmarkCircle, IoSearchOutline } from "react-icons/io5";
import { AiOutlinePlus } from "react-icons/ai";
import { MdEdit, MdDelete, MdCancel } from "react-icons/md";
import { RxCross2 } from "react-icons/rx";
import { IoMdCheckmark } from "react-icons/io";
import Link from 'next/link';

interface TableProps<T> {
    data: T[];
    headers: { name: string; span: number }[];
    onEdit: (item: T) => void;
    onDelete: (id: number) => void;
    onSubmit: (e: React.FormEvent) => void;
    searchPlaceholder: string;
    isCreating: boolean;
    toggleCreateForm: () => void;
    children: React.ReactNode;
    loader: boolean;
    noDataMessage: string;
    actionsEnabled?: boolean;
}

function Table<T extends { id: number }>({
    data,
    headers,
    onEdit,
    onDelete,
    onSubmit,
    searchPlaceholder,
    isCreating,
    toggleCreateForm,
    children,
    loader,
    noDataMessage,
    actionsEnabled = true,
}: TableProps<T>) {
    const searchInputRef = useRef<HTMLInputElement>(null);
    const formContainerRef = useRef<HTMLDivElement>(null);
    const [hoveredRowId, setHoveredRowId] = useState<number | null>(null);

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (formContainerRef.current && !formContainerRef.current.contains(event.target as Node)) {
                toggleCreateForm();
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [toggleCreateForm]);

    return (
        <>
            <div className="flex items-center justify-between max-sm:flex-col max-sm:gap-2">
                <div
                    className="max-sm:order-2 max-sm:w-full relative flex items-center"
                    onClick={() => searchInputRef.current.focus()}
                >
                    <div className="px-4 absolute h-full grid items-center pointer-events-none">
                        <IoSearchOutline className="size-5 text-gray-600" />
                    </div>
                    <input
                        type="search"
                        ref={searchInputRef}
                        className="w-auto max-sm:w-full text-base text-black border border-gray-300 px-10 pe-4 py-2 rounded-lg focus:outline-none focus:border-blue-600"
                        placeholder={searchPlaceholder}
                    />
                </div>
                <button
                    onClick={toggleCreateForm}
                    className="max-sm:w-full max-sm:order-1 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white flex gap-1 items-center justify-center">
                    <AiOutlinePlus className="size-4" />
                    Create Item
                </button>
            </div>

            {/* Header Row */}
            <div className="text-base text-black w-full">
                <div className={`px-2 py-4 grid grid-cols-${headers.length + (actionsEnabled ? 2 : 1)} bg-blue-100 border border-gray-300 rounded-t-lg`}>
                    {headers.map((header, index) => (
                        <div key={index} className={`px-2 font-semibold col-span-${header.span}`}>
                            <p>{header.name}</p>
                        </div>
                    ))}
                </div>

                {/* Data Rows */}
                <div className="border border-t-0 border-gray-300 rounded-b-lg">
                    {isCreating && (
                        <div ref={formContainerRef}>
                            <form onSubmit={onSubmit} className='bg-white grid grid-cols-6 items-center px-4 py-1 border-2 border-blue-600'>
                                {children}
                                <div className="flex items-center gap-4 justify-end">
                                    <button onClick={toggleCreateForm}><RxCross2 className='size-5 text-red-600 hover:text-red-400' /></button>
                                    <button type='submit'><IoMdCheckmark className='size-5 text-green-600 hover:text-green-400' /></button>
                                </div>
                            </form>
                        </div>
                    )}
                    {data.length ? (
                        data.map((item, index) => (
                            <div
                                key={item.id}
                                className={`px-2 py-3 hover:bg-gray-50 text-gray-600 ${index !== data.length - 1 ? 'border-b border-gray-300' : "rounded-b-lg"} items-center grid grid-cols-${headers.length + (actionsEnabled ? 2 : 1)}`}
                                onMouseEnter={() => setHoveredRowId(item.id)}
                                onMouseLeave={() => setHoveredRowId(null)}
                            >
                                {headers.map((header, i) => (
                                    <div key={i} className="px-2">
                                        <p>{item[header.name as keyof T]}</p>
                                    </div>
                                ))}
                                {actionsEnabled && hoveredRowId === item.id && (
                                    <div className="px-2 flex items-center gap-4 justify-end">
                                        <button onClick={() => onEdit(item)}><MdEdit className='size-5 text-gray-600 hover:text-yellow-400' /></button>
                                        <button onClick={() => onDelete(item.id)}><MdDelete className='size-5 text-gray-600 hover:text-red-400' /></button>
                                    </div>
                                )}
                            </div>
                        ))
                    ) : (
                        loader ? (
                            <div className='text-center px-4 py-3'>
                                <p>Loading...</p>
                            </div>
                        ) : (
                            <div className='text-center px-4 py-3'>
                                <h2 className='text-gray-600 text-base font-normal'>{noDataMessage}</h2>
                            </div>
                        )
                    )}
                </div>
            </div>
        </>
    );
}

export default Table;
