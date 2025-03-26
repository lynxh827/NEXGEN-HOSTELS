
import React, { createContext, useContext, useState, useEffect } from 'react';
import { User, UserRole } from '@/utils/types';
import { users } from '@/utils/mockData';
import { useToast } from '@/hooks/use-toast';
import { v4 as uuidv4 } from 'uuid';
import { saveUser, saveStudent, getUserByEmail, getUsers } from '@/utils/localStorage';

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string, role: UserRole, studentId?: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
  isLoading: boolean;
}

// Create a context to store password for demo
const PasswordContext = createContext<Record<string, string>>({});

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [passwords, setPasswords] = useState<Record<string, string>>({});
  const { toast } = useToast();

  useEffect(() => {
    // Check for stored user on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        setUser(JSON.parse(storedUser));
      } catch (error) {
        console.error('Error parsing stored user:', error);
        localStorage.removeItem('user');
      }
    }
    
    // Load stored passwords
    const storedPasswords = localStorage.getItem('passwords');
    if (storedPasswords) {
      try {
        setPasswords(JSON.parse(storedPasswords));
      } catch (error) {
        console.error('Error parsing stored passwords:', error);
        localStorage.removeItem('passwords');
      }
    } else {
      // Initialize with mock users (for demo)
      const initialPasswords: Record<string, string> = {};
      users.forEach(user => {
        initialPasswords[user.email] = 'password';
      });
      setPasswords(initialPasswords);
      localStorage.setItem('passwords', JSON.stringify(initialPasswords));
    }
    
    setIsLoading(false);
  }, []);

  const register = async (
    name: string,
    email: string,
    password: string,
    role: UserRole,
    studentId?: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // Check if user already exists
        const existingUser = getUserByEmail(email);
        
        if (existingUser) {
          toast({
            title: "Registration Failed",
            description: "A user with this email already exists",
            variant: "destructive",
          });
          setIsLoading(false);
          resolve(false);
          return;
        }
        
        // Create new user
        const newUser: User = {
          id: uuidv4(),
          name,
          email,
          role,
          studentId: role === 'student' ? studentId : undefined,
        };
        
        // Save password and user
        const updatedPasswords = { ...passwords, [email]: password };
        setPasswords(updatedPasswords);
        localStorage.setItem('passwords', JSON.stringify(updatedPasswords));
        
        // Save user to localStorage
        saveUser(newUser);
        
        // If student, also save to students collection
        if (role === 'student' && studentId) {
          const newStudent = {
            id: newUser.id,
            name,
            email,
            studentId,
            phone: '',
            bookings: []
          };
          saveStudent(newStudent);
        }
        
        // Auto-login the user
        setUser(newUser);
        localStorage.setItem('user', JSON.stringify(newUser));
        
        toast({
          title: "Registration Successful",
          description: `Welcome, ${name}!`,
        });
        
        setIsLoading(false);
        resolve(true);
      }, 1000);
    });
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    // In a real app, we would make an API call to validate credentials
    // For this demo, we'll check against our mock data and localStorage
    setIsLoading(true);
    
    return new Promise((resolve) => {
      // Simulate network delay
      setTimeout(() => {
        // First check mock data
        const foundMockUser = users.find(u => u.email === email);
        
        if (foundMockUser && password === 'password') {
          setUser(foundMockUser);
          localStorage.setItem('user', JSON.stringify(foundMockUser));
          toast({
            title: "Login Successful",
            description: `Welcome back, ${foundMockUser.name}!`,
          });
          setIsLoading(false);
          resolve(true);
          return;
        }
        
        // Then check localStorage data
        const allUsers = getUsers();
        const foundUser = allUsers.find(u => u.email === email);
        
        if (foundUser && passwords[email] === password) {
          setUser(foundUser);
          localStorage.setItem('user', JSON.stringify(foundUser));
          toast({
            title: "Login Successful",
            description: `Welcome back, ${foundUser.name}!`,
          });
          setIsLoading(false);
          resolve(true);
          return;
        }
        
        toast({
          title: "Login Failed",
          description: "Invalid email or password",
          variant: "destructive",
        });
        setIsLoading(false);
        resolve(false);
      }, 1000);
    });
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast({
      title: "Logged Out",
      description: "You have been successfully logged out",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      login,
      register,
      logout,
      isAuthenticated: !!user,
      isLoading
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
