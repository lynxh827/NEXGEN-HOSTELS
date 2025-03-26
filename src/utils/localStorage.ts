
import { User, Student } from './types';

export const getUsers = (): User[] => {
  const storedUsers = localStorage.getItem('users');
  return storedUsers ? JSON.parse(storedUsers) : [];
};

export const saveUser = (user: User): void => {
  const users = getUsers();
  users.push(user);
  localStorage.setItem('users', JSON.stringify(users));
};

export const getStudents = (): Student[] => {
  const storedStudents = localStorage.getItem('students');
  return storedStudents ? JSON.parse(storedStudents) : [];
};

export const saveStudent = (student: Student): void => {
  const students = getStudents();
  students.push(student);
  localStorage.setItem('students', JSON.stringify(students));
};

export const getUserByEmail = (email: string): User | undefined => {
  const users = getUsers();
  return users.find(user => user.email === email);
};
