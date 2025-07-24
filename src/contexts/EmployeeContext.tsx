import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Employee {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  position: string;
  department: string;
  salary: number;
  hireDate: string;
  status: 'active' | 'inactive' | 'terminated';
  address: string;
  avatar?: string;
  emergencyContact: {
    name: string;
    phone: string;
    relationship: string;
  };
}

interface EmployeeContextType {
  employees: Employee[];
  loading: boolean;
  addEmployee: (employee: Omit<Employee, 'id'>) => Promise<void>;
  updateEmployee: (id: string, employee: Partial<Employee>) => Promise<void>;
  deleteEmployee: (id: string) => Promise<void>;
  getEmployee: (id: string) => Employee | undefined;
}

const EmployeeContext = createContext<EmployeeContextType | undefined>(undefined);

export const useEmployees = () => {
  const context = useContext(EmployeeContext);
  if (context === undefined) {
    throw new Error('useEmployees must be used within an EmployeeProvider');
  }
  return context;
};

interface EmployeeProviderProps {
  children: ReactNode;
}

// Mock data for demo purposes
const mockEmployees: Employee[] = [
  {
    id: '4',
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@company.com',
    phone: '(555) 123-4567',
    position: 'Software Engineer',
    department: 'Engineering',
    salary: 75000,
    hireDate: '2023-01-15',
    status: 'active',
    address: '123 Main St, City, State 12345',
    avatar: 'https://images.pexels.com/photos/2379004/pexels-photo-2379004.jpeg?auto=compress&cs=tinysrgb&w=150',
    emergencyContact: {
      name: 'Jane Doe',
      phone: '(555) 987-6543',
      relationship: 'Spouse'
    }
  },
  {
    id: '5',
    firstName: 'Sarah',
    lastName: 'Johnson',
    email: 'sarah.johnson@company.com',
    phone: '(555) 234-5678',
    position: 'Product Manager',
    department: 'Product',
    salary: 85000,
    hireDate: '2022-08-22',
    status: 'active',
    address: '456 Oak Ave, City, State 12345',
    avatar: 'https://images.pexels.com/photos/774909/pexels-photo-774909.jpeg?auto=compress&cs=tinysrgb&w=150',
    emergencyContact: {
      name: 'Mike Johnson',
      phone: '(555) 876-5432',
      relationship: 'Brother'
    }
  },
  {
    id: '6',
    firstName: 'Mike',
    lastName: 'Chen',
    email: 'mike.chen@company.com',
    phone: '(555) 345-6789',
    position: 'UX Designer',
    department: 'Design',
    salary: 70000,
    hireDate: '2023-03-10',
    status: 'active',
    address: '789 Pine St, City, State 12345',
    avatar: 'https://images.pexels.com/photos/1040880/pexels-photo-1040880.jpeg?auto=compress&cs=tinysrgb&w=150',
    emergencyContact: {
      name: 'Lisa Chen',
      phone: '(555) 765-4321',
      relationship: 'Mother'
    }
  },
  {
    id: '7',
    firstName: 'Emily',
    lastName: 'Davis',
    email: 'emily.davis@company.com',
    phone: '(555) 456-7890',
    position: 'Marketing Specialist',
    department: 'Marketing',
    salary: 60000,
    hireDate: '2022-11-05',
    status: 'active',
    address: '321 Elm St, City, State 12345',
    avatar: 'https://images.pexels.com/photos/1181686/pexels-photo-1181686.jpeg?auto=compress&cs=tinysrgb&w=150',
    emergencyContact: {
      name: 'Tom Davis',
      phone: '(555) 654-3210',
      relationship: 'Father'
    }
  }
];

export const EmployeeProvider: React.FC<EmployeeProviderProps> = ({ children }) => {
  const [employees, setEmployees] = useState<Employee[]>(mockEmployees);
  const [loading, setLoading] = useState(false);

  const addEmployee = async (employeeData: Omit<Employee, 'id'>): Promise<void> => {
    setLoading(true);
    try {
      const newEmployee: Employee = {
        ...employeeData,
        id: Date.now().toString(),
      };
      setEmployees(prev => [...prev, newEmployee]);
    } finally {
      setLoading(false);
    }
  };

  const updateEmployee = async (id: string, employeeData: Partial<Employee>): Promise<void> => {
    setLoading(true);
    try {
      setEmployees(prev =>
        prev.map(emp => (emp.id === id ? { ...emp, ...employeeData } : emp))
      );
    } finally {
      setLoading(false);
    }
  };

  const deleteEmployee = async (id: string): Promise<void> => {
    setLoading(true);
    try {
      setEmployees(prev => prev.filter(emp => emp.id !== id));
    } finally {
      setLoading(false);
    }
  };

  const getEmployee = (id: string): Employee | undefined => {
    return employees.find(emp => emp.id === id);
  };

  const value = {
    employees,
    loading,
    addEmployee,
    updateEmployee,
    deleteEmployee,
    getEmployee,
  };

  return <EmployeeContext.Provider value={value}>{children}</EmployeeContext.Provider>;
};