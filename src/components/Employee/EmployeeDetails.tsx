import React from 'react';
import { ArrowLeft, Edit, Mail, Phone, MapPin, Calendar, DollarSign, Building, User } from 'lucide-react';
import { useEmployees } from '../../contexts/EmployeeContext';
import { Employee } from '../../contexts/EmployeeContext';

interface EmployeeDetailsProps {
  employeeId: string;
  onEdit: () => void;
  onBack: () => void;
  isOwnProfile?: boolean;
}

const EmployeeDetails: React.FC<EmployeeDetailsProps> = ({ employeeId, onEdit, onBack, isOwnProfile = false }) => {
  const { getEmployee } = useEmployees();
  const { user } = useAuth();
  const employee = getEmployee(employeeId);

  if (!employee) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">Employee not found.</p>
        <button
          onClick={onBack}
          className="mt-4 text-blue-600 hover:text-blue-800"
        >
          Go back
        </button>
      </div>
    );
  }

  const getStatusBadge = (status: Employee['status']) => {
    const statusStyles = {
      active: 'bg-green-100 text-green-800',
      inactive: 'bg-yellow-100 text-yellow-800',
      terminated: 'bg-red-100 text-red-800',
    };

    return (
      <span className={`inline-flex px-3 py-1 text-sm font-semibold rounded-full ${statusStyles[status]}`}>
        {status.charAt(0).toUpperCase() + status.slice(1)}
      </span>
    );
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <button
          onClick={onBack}
          className="flex items-center text-gray-600 hover:text-gray-900 transition-colors"
        >
          <ArrowLeft className="h-5 w-5 mr-2" />
          {isOwnProfile ? 'Back to Dashboard' : 'Back to Employees'}
        </button>
        {!isOwnProfile && user?.role !== 'employee' && (
          <button
            onClick={onEdit}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Edit className="h-4 w-4 mr-2" />
            Edit Employee
          </button>
        )}
      </div>

      {/* Employee Profile */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600"></div>
        <div className="px-6 pb-6">
          <div className="flex items-center space-x-6 -mt-16">
            <img
              src={employee.avatar || `https://ui-avatars.com/api/?name=${employee.firstName}+${employee.lastName}&background=random`}
              alt={`${employee.firstName} ${employee.lastName}`}
              className="h-32 w-32 rounded-full border-4 border-white object-cover shadow-lg"
            />
            <div className="pt-16">
              <h1 className="text-3xl font-bold text-gray-900">
                {employee.firstName} {employee.lastName}
                {isOwnProfile && <span className="text-lg text-blue-600 ml-2">(You)</span>}
              </h1>
              <p className="text-xl text-gray-600 mt-1">{employee.position}</p>
              <div className="flex items-center space-x-4 mt-3">
                {getStatusBadge(employee.status)}
                <span className="text-sm text-gray-500">
                  Employee ID: {employee.id}
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Contact Information */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Contact Information</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Mail className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Email</p>
                <p className="text-gray-900">{employee.email}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Phone className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Phone</p>
                <p className="text-gray-900">{employee.phone}</p>
              </div>
            </div>
            <div className="flex items-start space-x-3">
              <MapPin className="h-5 w-5 text-gray-400 mt-1" />
              <div>
                <p className="text-sm text-gray-500">Address</p>
                <p className="text-gray-900">{employee.address}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Employment Details */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Employment Details</h3>
          <div className="space-y-4">
            <div className="flex items-center space-x-3">
              <Building className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Department</p>
                <p className="text-gray-900">{employee.department}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <Calendar className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Hire Date</p>
                <p className="text-gray-900">{new Date(employee.hireDate).toLocaleDateString()}</p>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              <DollarSign className="h-5 w-5 text-gray-400" />
              <div>
                <p className="text-sm text-gray-500">Annual Salary</p>
                <p className="text-gray-900">${employee.salary.toLocaleString()}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Emergency Contact */}
        {employee.emergencyContact.name && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Emergency Contact</h3>
            <div className="space-y-4">
              <div className="flex items-center space-x-3">
                <User className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Name</p>
                  <p className="text-gray-900">{employee.emergencyContact.name}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <Phone className="h-5 w-5 text-gray-400" />
                <div>
                  <p className="text-sm text-gray-500">Phone</p>
                  <p className="text-gray-900">{employee.emergencyContact.phone}</p>
                </div>
              </div>
              <div className="flex items-center space-x-3">
                <div className="h-5 w-5 flex items-center justify-center">
                  <div className="h-3 w-3 bg-gray-400 rounded-full"></div>
                </div>
                <div>
                  <p className="text-sm text-gray-500">Relationship</p>
                  <p className="text-gray-900">{employee.emergencyContact.relationship}</p>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Quick Stats */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Stats</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Time with Company</span>
              <span className="font-medium text-gray-900">
                {Math.floor((new Date().getTime() - new Date(employee.hireDate).getTime()) / (1000 * 60 * 60 * 24 * 365.25))} years
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Monthly Salary</span>
              <span className="font-medium text-gray-900">
                ${Math.round(employee.salary / 12).toLocaleString()}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Employee Status</span>
              <span className="font-medium text-gray-900 capitalize">{employee.status}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EmployeeDetails;