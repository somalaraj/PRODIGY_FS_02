import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'hr' | 'manager' | 'employee';
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  register: (email: string, password: string, name: string, role: string) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

// Mock users for demo purposes
const mockUsers: User[] = [
  { id: '1', email: 'admin@company.com', name: 'Admin User', role: 'admin' },
  { id: '2', email: 'hr@company.com', name: 'HR Manager', role: 'hr' },
  { id: '3', email: 'manager@company.com', name: 'Department Manager', role: 'manager' },
  { id: '4', email: 'john.doe@company.com', name: 'John Doe', role: 'employee' },
  { id: '5', email: 'sarah.johnson@company.com', name: 'Sarah Johnson', role: 'employee' },
  { id: '6', email: 'mike.chen@company.com', name: 'Mike Chen', role: 'employee' },
  { id: '7', email: 'emily.davis@company.com', name: 'Emily Davis', role: 'employee' },
];

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for stored user session
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<void> => {
    // Mock authentication - in real app, this would call Supabase
    const foundUser = mockUsers.find(u => u.email === email);
    if (foundUser && password === 'password123') {
      setUser(foundUser);
      localStorage.setItem('currentUser', JSON.stringify(foundUser));
    } else {
      throw new Error('Invalid credentials');
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('currentUser');
  };

  const register = async (email: string, password: string, name: string, role: string): Promise<void> => {
    // Mock registration
    const newUser: User = {
      id: Date.now().toString(),
      email,
      name,
      role: role as 'admin' | 'hr' | 'manager' | 'employee'
    };
    setUser(newUser);
    localStorage.setItem('currentUser', JSON.stringify(newUser));
  };

  const value = {
    user,
    loading,
    login,
    logout,
    register,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export { AuthContext }