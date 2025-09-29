'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { AppointmentBookingForm } from '@/components/forms/AppointmentBookingForm';

interface Appointment {
  id: string;
  appointmentDate: string;
  appointmentTime: string;
  status: string;
  reason: string;
  patient: {
    firstName: string;
    lastName: string;
    phoneNumber: string;
  };
  doctor: {
    firstName: string;
    lastName: string;
    specialization: string;
    consultationFee: number;
    department: {
      name: string;
    };
  };
}

export default function AppointmentsPage() {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [loading, setLoading] = useState(true);
  const [showBooking, setShowBooking] = useState(false);

  useEffect(() => {
    fetchAppointments();
  }, [user]);

  const fetchAppointments = async () => {
    if (!user) return;

    try {
      const params = new URLSearchParams();
      
      if (user.role === 'PATIENT') {
        params.append('patientId', user.profile?.id || '');
      } else if (user.role === 'DOCTOR') {
        params.append('doctorId', user.profile?.id || '');
      }

      const response = await fetch(`/api/appointments?${params}`);
      if (response.ok) {
        const data = await response.json();
        setAppointments(data);
      }
    } catch (error) {
      console.error('Error fetching appointments:', error);
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'SCHEDULED':
        return 'bg-blue-100 text-blue-800';
      case 'CONFIRMED':
        return 'bg-green-100 text-green-800';
      case 'COMPLETED':
        return 'bg-gray-100 text-gray-800';
      case 'CANCELLED':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleBookingSuccess = () => {
    setShowBooking(false);
    fetchAppointments();
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-600">Loading appointments...</div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
        {user?.role === 'PATIENT' && (
          <Button onClick={() => setShowBooking(!showBooking)}>
            {showBooking ? 'View Appointments' : 'Book New Appointment'}
          </Button>
        )}
      </div>

      {showBooking ? (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Book New Appointment</h2>
          <AppointmentBookingForm onSuccess={handleBookingSuccess} />
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-md">
          {appointments.length === 0 ? (
            <div className="p-8 text-center text-gray-500">
              <p>No appointments found</p>
              {user?.role === 'PATIENT' && (
                <Button 
                  onClick={() => setShowBooking(true)}
                  className="mt-4"
                >
                  Book Your First Appointment
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Date & Time
                    </th>
                    {user?.role !== 'PATIENT' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Patient
                      </th>
                    )}
                    {user?.role !== 'DOCTOR' && (
                      <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Doctor
                      </th>
                    )}
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Department
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                      Reason
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {appointments.map((appointment) => (
                    <tr key={appointment.id} className="hover:bg-gray-50">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm font-medium text-gray-900">
                          {new Date(appointment.appointmentDate).toLocaleDateString()}
                        </div>
                        <div className="text-sm text-gray-500">
                          {appointment.appointmentTime}
                        </div>
                      </td>
                      {user?.role !== 'PATIENT' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            {appointment.patient.firstName} {appointment.patient.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.patient.phoneNumber}
                          </div>
                        </td>
                      )}
                      {user?.role !== 'DOCTOR' && (
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">
                            Dr. {appointment.doctor.firstName} {appointment.doctor.lastName}
                          </div>
                          <div className="text-sm text-gray-500">
                            {appointment.doctor.specialization}
                          </div>
                        </td>
                      )}
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                        {appointment.doctor.department.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(appointment.status)}`}>
                          {appointment.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 text-sm text-gray-900">
                        <div className="max-w-xs truncate">
                          {appointment.reason}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      )}
    </div>
  );
}