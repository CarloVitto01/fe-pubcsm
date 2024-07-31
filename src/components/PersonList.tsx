import React, { useEffect, useState } from 'react';
import { getPersons, createPerson, deletePerson } from '../api/personService'; // Aggiungi deletePerson
import { Person } from '../types';
import './PersonList.css'; // Importa il file CSS

const PersonList: React.FC = () => {
    const [persons, setPersons] = useState<Person[]>([]);
    const [newPerson, setNewPerson] = useState<Person>({ name: '', age: 0 });
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchPersons = async () => {
            try {
                const response = await getPersons();
                setPersons(response.data);
            } catch (error) {
                console.error('Error fetching persons:', error);
            }
        };

        fetchPersons();
    }, []);

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setNewPerson((prevPerson) => ({
            ...prevPerson,
            [name]: name === 'age' ? Number(value) : value,
        }));
    };

    const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        setError(null); // Reset error

        try {
            await createPerson(newPerson);
            setNewPerson({ name: '', age: 0 }); // Clear form
            const response = await getPersons(); // Refresh list
            setPersons(response.data);
        } catch (error) {
            setError('Failed to create person');
            console.error('Error creating person:', error);
        }
    };

    const handleDelete = async (personId: number) => {
        setError(null); // Reset error

        try {
            await deletePerson(personId);
            const response = await getPersons(); // Refresh list
            setPersons(response.data);
        } catch (error) {
            setError('Failed to delete person');
            console.error('Error deleting person:', error);
        }
    };

    return (
        <div>
            <h1>Persons</h1>
            <form onSubmit={handleSubmit}>
                <div>
                    <label htmlFor="name">Nome:</label>
                    <span>Inserisci il nome: </span>
                    <input
                        type="text"
                        id="name"
                        name="name"
                        value={newPerson.name}
                        onChange={handleChange}
                        required
                    />
                </div>
                <button type="submit">Aggiungi</button>
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </form>
            <ul>
                {persons.map(person => (
                    <li key={person.id} className="person-list-item">
                        {person.name}
                        <button 
                            onClick={() => handleDelete(person.id!)}
                            className="delete-button"
                        >
                            Elimina
                        </button>
                    </li>
                ))}
            </ul>
        </div>
    );
};

export default PersonList;
