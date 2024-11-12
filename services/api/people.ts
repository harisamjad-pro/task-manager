export const createPeopleAPI = async (personData: {
    name: string;
}) => {
    const response = await fetch('/api/people', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(personData),
    });

    if (!response.ok) throw new Error('Failed to create people');
};

export const readPeopleAPI = async () => {
    const response = await fetch('/api/people');
    if (!response.ok) throw new Error('Failed to read people');
    return response.json();
}

export const updatePeopleAPI = async (personData: {
    id: number;
    name: string;
}) => {
    const response = await fetch('/api/people', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(personData),
    });

    if (!response.ok) throw new Error('Failed to update people');
};

export const deletePeopleAPI = async (id: number) => {
    const response = await fetch('/api/people', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    });

    if (!response.ok) throw new Error('Failed to delete people');
};