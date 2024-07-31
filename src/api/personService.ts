import axios from './axios';
import { Person } from '../types';

export const getPersons = () => axios.get<Person[]>('/persons');
export const getPersonById = (id: number) => axios.get<Person>(`/persons/${id}`);
export const createPerson = (person: Person) => axios.post<Person>('/persons', person);
export const updatePerson = (id: number, person: Person) => axios.put<Person>(`/persons/${id}`, person);
export const deletePerson = (id: number) => axios.delete<void>(`/persons/${id}`);
