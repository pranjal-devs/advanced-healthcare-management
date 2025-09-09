'use client';

import Link from 'next/link';
import { Card, CardHeader, CardContent } from '@/components/ui/Card';
import { Badge } from '@/components/ui/Badge';
import { Button } from '@/components/ui/Button';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { RecentAppointment } from '@/types/dashboard';

const CalendarIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
  </svg>
);

const ArrowRightIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
  </svg>
);

const UserIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
  </svg>
);

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

interface RecentAppointmentsProps {
  appointments: RecentAppointment[];
  isLoading?: boolean;
  userRole?: string;
}

const getStatusVariant = (status: string) => {
  switch (status) {
    case 'SCHEDULED':
      return 'info';
    case 'CONFIRMED':
      return 'success';
    case 'COMPLETED':
      return 'success';
    case 'CANCELLED':
      return 'danger';
    case 'NO_SHOW':
      return 'warning';
    default:
      return 'default';
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case 'SCHEDULED':
      return 'Scheduled';
    case 'CONFIRMED':
      return 'Confirmed';
    case 'COMPLETED':
      return 'Completed';
    case 'CANCELLED':
      return 'Cancelled';
    case 'NO_SHOW':
      return 'No Show';
    default:
      return status;
  }
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  });
};

const formatTime = (timeString: string) => {
  // Assuming time is in format like "10:30 AM"
  return timeString;
};

const AppointmentItem = ({ appointment, userRole }: { 
  appointment: RecentAppointment; 
  userRole?: string; 
}) => {
  return (
    <div className="flex items-center justify-between p-4 border border-gray-100 rounded-lg hover:border-gray-200 transition-colors">
      <div className="flex items-center space-x-4">
        <div className="flex-shrink-0">
          <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
            <CalendarIcon className="h-5 w-5 text-blue-600" />
          </div>
        </div>
        
        <div className="flex-1 min-w-0">
          <div className="flex items-center space-x-2 mb-1">
            <h4 className="text-sm font-medium text-gray-900 truncate">
              {userRole === 'DOCTOR' 
                ? `${appointment.patient.firstName} ${appointment.patient.lastName}`
                : userRole === 'PATIENT'
                ? `Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`
                : `${appointment.patient.firstName} ${appointment.patient.lastName} - Dr. ${appointment.doctor.firstName} ${appointment.doctor.lastName}`
              }
            </h4>
            <Badge variant={getStatusVariant(appointment.status)} size="sm">
              {getStatusLabel(appointment.status)}
            </Badge>
          </div>
          
          <div className="flex items-center space-x-4 text-sm text-gray-500">
            <div className="flex items-center">
              <CalendarIcon className="h-4 w-4 mr-1" />
              {formatDate(appointment.appointmentDate)}
            </div>
            <div className="flex items-center">
              <ClockIcon className="h-4 w-4 mr-1" />
              {formatTime(appointment.appointmentTime)}
            </div>
          </div>
          
          {userRole !== 'PATIENT' && (
            <p className="text-xs text-gray-500 mt-1">
              {appointment.doctor.specialization}
            </p>
          )}
          
          <p className="text-xs text-gray-600 mt-1 truncate">
            {appointment.reason}
          </p>
        </div>
      </div>
      
      <div className="flex-shrink-0">
        <Link href={`/appointments/${appointment.id}`}>
          <Button variant="ghost" size="sm">
            <ArrowRightIcon className="h-4 w-4" />
          </Button>
        </Link>
      </div>
    </div>
  );
};

export const RecentAppointments = ({ 
  appointments, 
  isLoading, 
  userRole 
}: RecentAppointmentsProps) => {
  const getTitle = () => {
    switch (userRole) {
      case 'DOCTOR':
        return 'Today\'s Appointments';
      case 'PATIENT':
        return 'My Upcoming Appointments';
      default:
        return 'Recent Appointments';
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <CalendarIcon className="h-5 w-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">
              {getTitle()}
            </h3>
          </div>
          <Link href="/appointments">
            <Button variant="ghost" size="sm">
              View All
              <ArrowRightIcon className="ml-1 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </CardHeader>
      
      <CardContent>
        {isLoading ? (
          <div className="flex items-center justify-center py-8">
            <LoadingSpinner size="md" />
          </div>
        ) : appointments.length === 0 ? (
          <div className="text-center py-8">
            <CalendarIcon className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <h4 className="text-sm font-medium text-gray-900 mb-2">
              No appointments found
            </h4>
            <p className="text-sm text-gray-500 mb-4">
              {userRole === 'PATIENT' 
                ? 'You don\'t have any upcoming appointments.'
                : 'No recent appointments to display.'
              }
            </p>
            <Link href="/appointments/new">
              <Button size="sm">
                {userRole === 'PATIENT' ? 'Book Appointment' : 'Schedule Appointment'}
              </Button>
            </Link>
          </div>
        ) : (
          <div className="space-y-3">
            {appointments.slice(0, 5).map((appointment) => (
              <AppointmentItem
                key={appointment.id}
                appointment={appointment}
                userRole={userRole}
              />
            ))}
            
            {appointments.length > 5 && (
              <div className="pt-4 border-t border-gray-100">
                <Link href="/appointments">
                  <Button variant="outline" size="sm" className="w-full">
                    View {appointments.length - 5} more appointments
                  </Button>
                </Link>
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};