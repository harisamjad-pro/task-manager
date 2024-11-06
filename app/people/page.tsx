"use client"; // Client component

import React, { useEffect, useState } from 'react';

const PeoplePage = () => {
    const [people, setPeople] = useState<{ id: number; name: string }[]>([]);
    const [name, setName] = useState('');
    const [editingPerson, setEditingPerson] = useState<{ id: number; name: string } | null>(null);

    const fetchPeople = async () => {
        const res = await fetch('/api/people');
        const data = await res.json();
        setPeople(data);
    };

    useEffect(() => {
        fetchPeople();
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (editingPerson) {
            await fetch('/api/people', {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ id: editingPerson.id, name }),
            });
            setEditingPerson(null);
        } else {
            await fetch('/api/people', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ name }),
            });
        }
        setName('');
        fetchPeople();
    };

    const handleEdit = (person: { id: number; name: string }) => {
        setEditingPerson(person);
        setName(person.name);
    };

    const handleDelete = async (id: number) => {
        await fetch('/api/people', {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ id }),
        });
        fetchPeople();
    };

    return (
        <div>
            <h1>People</h1>
            <form onSubmit={handleSubmit}>
                <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Person Name"
                    required
                />
                <button type="submit">{editingPerson ? 'Update' : 'Add'} Person</button>
            </form>
            <ul>
                {people.map(person => (
                    <li key={person.id}>
                        <span>{person.name}</span>
                        <button onClick={() => handleEdit(person)}>Edit</button>
                        <button onClick={() => handleDelete(person.id)}>Delete</button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PeoplePage;
