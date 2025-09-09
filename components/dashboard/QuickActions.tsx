'use client';

import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';

// Icons
const PlusIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
  </svg>
);

const UsersIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const DocumentIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const PrescriptionIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
  </svg>
);

const BillingIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 9V7a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2m2 4h10a2 2 0 002-2v-6a2 2 0 00-2-2H9a2 2 0 00-2 2v6a2 2 0 002 2zm7-5a2 2 0 11-4 0 2 2 0 014 0z" />
  </svg>
);

const MedicationIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.387-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
  </svg>
);

const DepartmentIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
  </svg>
);

interface QuickAction {
  title: string;
  description: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'indigo';
  roles: string[];
}

interface QuickActionsProps {
  userRole?: string;
}

const quickActions: QuickAction[] = [
  {
    title: 'Add New Patient',
    description: 'Register a new patient in the system',
    href: '/patients/new',
    icon: UsersIcon,
    color: 'blue',
    roles: ['ADMIN', 'DOCTOR']
  },
  {
    title: 'Add New Doctor',
    description: 'Register a new doctor',
    href: '/doctors/new',
    icon: UserIcon,
    color: 'green',
    roles: ['ADMIN']
  },
  {
    title: 'Schedule Appointment',
    description: 'Book a new appointment',
    href: '/appointments/new',
    icon: CalendarIcon,
    color: 'purple',
    roles: ['ADMIN', 'DOCTOR', 'PATIENT']
  },
  {
    title: 'Add Medical Record',
    description: 'Create a new medical record',
    href: '/medical-records/new',
    icon: DocumentIcon,
    color: 'indigo',
    roles: ['ADMIN', 'DOCTOR']
  },
  {
    title: 'Create Prescription',
    description: 'Write a new prescription',
    href: '/prescriptions/new',
    icon: PrescriptionIcon,
    color: 'green',
    roles: ['ADMIN', 'DOCTOR']
  },
  {
    title: 'Generate Bill',
    description: 'Create a new bill',
    href: '/billing/new',
    icon: BillingIcon,
    color: 'yellow',
    roles: ['ADMIN']
  },
  {
    title: 'Add Medication',
    description: 'Add new medication to inventory',
    href: '/medications/new',
    icon: MedicationIcon,
    color: 'red',
    roles: ['ADMIN']
  },
  {
    title: 'Add Department',
    description: 'Create a new department',
    href: '/departments/new',
    icon: DepartmentIcon,
    color: 'indigo',
    roles: ['ADMIN']
  }
];

const ActionCard = ({ action }: { action: QuickAction }) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600 hover:bg-blue-100',
    green: 'bg-green-50 text-green-600 hover:bg-green-100',
    yellow: 'bg-yellow-50 text-yellow-600 hover:bg-yellow-100',
    purple: 'bg-purple-50 text-purple-600 hover:bg-purple-100',
    red: 'bg-red-50 text-red-600 hover:bg-red-100',
    indigo: 'bg-indigo-50 text-indigo-600 hover:bg-indigo-100'
  };

  const Icon = action.icon;

  return (
    <Link href={action.href}>
      <div className="group relative bg-white border border-gray-200 rounded-lg p-6 hover:border-gray-300 hover:shadow-md transition-all duration-200 cursor-pointer">
        <div>
          <div className={`rounded-lg p-3 w-fit ${colorClasses[action.color]} transition-colors`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900 group-hover:text-gray-800">
              {action.title}
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              {action.description}
            </p>
          </div>
        </div>
        <div className="absolute top-4 right-4">
          <PlusIcon className="h-5 w-5 text-gray-400 group-hover:text-gray-500" />
        </div>
      </div>
    </Link>
  );
};

export const QuickActions = ({ userRole }: QuickActionsProps) => {
  const filteredActions = quickActions.filter(action => 
    userRole && action.roles.includes(userRole)
  );

  const getTitle = () => {
    switch (userRole) {
      case 'ADMIN':
        return 'Admin Actions';
      case 'DOCTOR':
        return 'Quick Actions';
      case 'PATIENT':
        return 'Available Actions';
      default:
        return 'Quick Actions';
    }
  };

  if (filteredActions.length === 0) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center space-x-2">
          <PlusIcon className="h-5 w-5 text-blue-600" />
          <h3 className="text-lg font-semibold text-gray-900">
            {getTitle()}
          </h3>
        </div>
        <p className="text-sm text-gray-600 mt-1">
          Quickly access common tasks and create new records
        </p>
      </CardHeader>
      
      <CardContent>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredActions.map((action) => (
            <ActionCard key={action.href} action={action} />
          ))}
        </div>
      </CardContent>
    </Card>
  );
};