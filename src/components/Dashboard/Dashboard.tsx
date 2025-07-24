import React, { useState } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import EmployeeList from '../Employee/EmployeeList';
import EmployeeForm from '../Employee/EmployeeForm';
import EmployeeDetails from '../Employee/EmployeeDetails';
import DashboardStats from './DashboardStats';
import { useAuth } from '../../contexts/AuthContext';
import { useEmployees } from '../../contexts/EmployeeContext';

type ViewType = 'dashboard' | 'employees' | 'add-employee' | 'employee-details' | 'edit-employee' | 'my-profile';

const Dashboard: React.FC = () => {
  const { user } = useAuth();
  const { employees } = useEmployees();
  const [currentView, setCurrentView] = useState<ViewType>('dashboard');
  const [selectedEmployeeId, setSelectedEmployeeId] = useState<string | null>(null);

  const handleViewEmployee = (id: string) => {
    setSelectedEmployeeId(id);
    setCurrentView('employee-details');
  };

  const handleEditEmployee = (id: string) => {
    // Employees cannot edit any records
    if (user?.role === 'employee') return;
    
    setSelectedEmployeeId(id);
    setCurrentView('edit-employee');
  };

  const renderContent = () => {
    // For employees, find their own record
    if (user?.role === 'employee') {
      const employeeRecord = employees.find(emp => emp.email === user.email);
      if (employeeRecord && !selectedEmployeeId) {
        setSelectedEmployeeId(employeeRecord.id);
      }
    }

    switch (currentView) {
      case 'dashboard':
        if (user?.role === 'employee') {
          return <DashboardStats onViewEmployees={() => setCurrentView('my-profile')} />;
        }
        return <DashboardStats onViewEmployees={() => setCurrentView('employees')} />;
      case 'employees':
        if (user?.role === 'employee') {
          return <div className="text-center py-12"><p className="text-gray-500">Access denied.</p></div>;
        }
        return (
          <EmployeeList
            onViewEmployee={handleViewEmployee}
            onEditEmployee={handleEditEmployee}
          />
        );
      case 'add-employee':
        if (user?.role === 'employee') {
          return <div className="text-center py-12"><p className="text-gray-500">Access denied.</p></div>;
        }
        return (
          <EmployeeForm
            onSuccess={() => setCurrentView('employees')}
            onCancel={() => setCurrentView('employees')}
          />
        );
      case 'my-profile':
        if (user?.role === 'employee') {
          const employeeRecord = employees.find(emp => emp.email === user.email);
          if (employeeRecord) {
            return (
              <EmployeeDetails
                employeeId={employeeRecord.id}
                onEdit={() => {}} // No edit for employees
                onBack={() => setCurrentView('dashboard')}
                isOwnProfile={true}
              />
            );
          }
        }
        return <div className="text-center py-12"><p className="text-gray-500">Profile not found.</p></div>;
      case 'employee-details':
        return (
          <EmployeeDetails
            employeeId={selectedEmployeeId!}
            onEdit={user?.role === 'employee' ? () => {} : () => setCurrentView('edit-employee')}
            onBack={() => setCurrentView('employees')}
            isOwnProfile={false}
          />
        );
      case 'edit-employee':
        if (user?.role === 'employee') {
          return <div className="text-center py-12"><p className="text-gray-500">Access denied.</p></div>;
        }
        return (
          <EmployeeForm
            employeeId={selectedEmployeeId!}
            onSuccess={() => setCurrentView('employees')}
            onCancel={() => setCurrentView('employees')}
          />
        );
      default:
        return <DashboardStats onViewEmployees={() => setCurrentView('employees')} />;
    }
  };

  return (
    <div className="flex h-screen bg-gray-50">
      <Sidebar currentView={currentView} onViewChange={setCurrentView} />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-50 p-6">
          {renderContent()}
        </main>
      </div>
    </div>
  );
};

export default Dashboard;