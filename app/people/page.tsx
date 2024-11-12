"use client";

import React, { useEffect, useRef, useState } from 'react';
import { createPeopleAPI, deletePeopleAPI, readPeopleAPI, updatePeopleAPI } from '@/services/api/people';
import Toaster from '@/components/ui/Toaster';
import { IoCheckmarkCircle } from 'react-icons/io5';
import { MdCancel } from 'react-icons/md';

interface People {
    id: number,
    name: string
}

const PeoplePage = () => {
    // useState
    const [people, setPeople] = useState<People[]>([]);
    const [name, setName] = useState('');
    const [updatingPersonId, setUpdatingPersonId] = useState<{ id: number; name: string } | null>(null);
    const [loader, setLoader] = useState(true);
    const [createToaster, setCreateToaster] = useState(false);
    const [updateToaster, setUpdateToaster] = useState(false);
    const [deleteToaster, setDeleteToaster] = useState(false);
    const [failToaster, setFailToaster] = useState(false);

    // useRef
    // const searchInputRef = useRef<HTMLInputElement>(null);
    // const formInputRef = useRef<HTMLInputElement>(null);
    // const formContainerRef = useRef<HTMLInputElement>(null);
    const successSoundRef = useRef<HTMLAudioElement | null>(null);
    const failedSoundRef = useRef<HTMLAudioElement | null>(null);

    const clearToasters = () => {
        setCreateToaster(false);
        setUpdateToaster(false);
        setDeleteToaster(false);
        setFailToaster(false);
    }

    const fetchPeople = async () => {
        setLoader(true);
        try {
            const data = await readPeopleAPI();
            setPeople(data);
        } catch (error) {
            console.log("Error fetching people:", error);
        } finally {
            setLoader(false);
        }
    };

    const clearSounds = () => [successSoundRef, failedSoundRef].forEach(ref => ref.current?.pause() && (ref.current.currentTime = 0));

    useEffect(() => {
        fetchPeople();

        successSoundRef.current = new Audio('/audio/success.mp3');
        failedSoundRef.current = new Audio('/audio/failed.mp3');
    }, []);

    const clearInputs = () => {
        setName('');
        setUpdatingPersonId(null);
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoader(true);
        clearToasters();
        clearSounds();

        const personData = { name };

        try {
            if (updatingPersonId) {
                await updatePeopleAPI({ ...personData, id: updatingPersonId });
                setUpdateToaster(true);
            } else {
                await createPeopleAPI(personData);
                setCreateToaster(true);
            }

            clearInputs();
            fetchPeople();
            // setToggleCreateForm(false);

            if (successSoundRef.current) successSoundRef.current.play();
        } catch (error) {
            console.error('Error submitting people:', error);
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

    const handleUpdate = (person: People) => {
        setUpdatingPersonId(person.id);
        setName(person.name);
    };

    const handleDelete = async (id: number) => {
        setLoader(true);
        clearToasters();
        clearSounds();
        try {
            await deletePeopleAPI(id);
            fetchPeople();
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

    const toasters = [
        { condition: createToaster, title: "People Created", icon: <IoCheckmarkCircle className="text-green-600 size-5" /> },
        { condition: updateToaster, title: "People Updated", icon: <IoCheckmarkCircle className="text-green-600 size-5" /> },
        { condition: deleteToaster, title: "People Deleted", icon: <IoCheckmarkCircle className="text-green-600 size-5" /> },
        { condition: failToaster, title: "Operation Failed", icon: <MdCancel className="text-red-600 size-5" /> }
    ];

    return (
        <>
            {toasters.map((toast, index) => toast.condition && (<Toaster key={index} title={toast.title} icon={toast.icon} />))}
            <div className="grid gap-6">
                <div className="grid gap-2">
                    <h1 className="text-3xl font-semibold">Manage People</h1>
                    <p className='text-gray-600'>List of people to add or manage.</p>
                </div>
                <h1>People</h1>
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Person Name"
                        required
                    />
                    <button type="submit">{updatingPersonId ? 'Update' : 'Add'} Person</button>
                </form>
                <ul>
                    {people.map(person => (
                        <li key={person.id}>
                            <span>{person.name}</span>
                            <button onClick={() => handleUpdate(person)}>Edit</button>
                            <button onClick={() => handleDelete(person.id)}>Delete</button>
                        </li>
                    ))}
                </ul>
            </div>
        </>
    );
};

export default PeoplePage;
