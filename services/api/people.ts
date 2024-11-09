export const readPeopleAPI = async () => {
    const response = await fetch('/api/people');
    if (!response.ok) throw new Error('Failed to read people');
    return response.json();
}