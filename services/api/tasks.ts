export const createTaskAPI = async (taskData: {
    title: string;
    dueDate: string;
    peopleIds: number[];
    status: string;
}) => {
    const response = await fetch('/api/tasks', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
    });

    if (!response.ok) throw new Error('Failed to create task');
};

export const readTaskAPI = async () => {
    const response = await fetch('/api/tasks');
    if (!response.ok) throw new Error('Failed to read task');
    return response.json();
}

export const updateTaskAPI = async (taskData: {
    id: number;
    title: string;
    dueDate: string;
    peopleIds: number[];
    status: string;
}) => {
    const response = await fetch('/api/tasks', {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(taskData),
    });

    if (!response.ok) throw new Error('Failed to update task');
};

export const deleteTaskAPI = async (id: number) => {
    const response = await fetch('/api/tasks', {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id }),
    });

    if (!response.ok) throw new Error('Failed to delete task');
};