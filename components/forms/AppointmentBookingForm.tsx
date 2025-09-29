'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';

interface Department {
  id: string;
  name: string;
  doctors: Doctor[];
}

interface Doctor {
  id: string;
  firstName: string;
  lastName: string;
  specialization: string;
  consultationFee: number;
  experience: number;
}

interface TimeSlot {
  time: string;
  available: boolean;
}

interface AppointmentBookingFormProps {
  onSuccess?: () => void;
}

export function AppointmentBookingForm({ onSuccess }: AppointmentBookingFormProps) {
  const { user } = useAuth();
  const [step, setStep] = useState(1);
  const [departments, setDepartments] = useState<Department[]>([]);
  const [selectedDepartment, setSelectedDepartment] = useState<Department | null>(null);
  const [selectedDoctor, setSelectedDoctor] = useState<Doctor | null>(null);
  const [selectedDate, setSelectedDate] = useState('');
  const [selectedTime, setSelectedTime] = useState('');
  const [reason, setReason] = useState('');
  const [timeSlots, setTimeSlots] = useState<TimeSlot[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch departments on mount
  useEffect(() => {
    fetchDepartments();
  }, []);

  // Fetch time slots when doctor and date are selected
  useEffect(() => {
    if (selectedDoctor && selectedDate) {
      fetchTimeSlots();
    }
  }, [selectedDoctor, selectedDate]);

  const fetchDepartments = async () => {
    try {
      const response = await fetch('/api/departments');
      if (response.ok) {
        const data = await response.json();
        setDepartments(data);
      }
    } catch (error) {
      console.error('Error fetching departments:', error);
    }
  };

  const fetchTimeSlots = async () => {
    if (!selectedDoctor || !selectedDate) return;
    
    try {
      const response = await fetch(`/api/doctors/${selectedDoctor.id}/availability?date=${selectedDate}`);
      if (response.ok) {
        const data = await response.json();
        setTimeSlots(data.slots);
      }
    } catch (error) {
      console.error('Error fetching time slots:', error);
    }
  };

  const handleSubmit = async () => {
    if (!selectedDoctor || !selectedDate || !selectedTime || !reason.trim()) {
      setError('Please fill all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const response = await fetch('/api/appointments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          patientId: user?.profile?.id,
          doctorId: selectedDoctor.id,
          appointmentDate: selectedDate,
          appointmentTime: selectedTime,
          reason,
        }),
      });

      if (response.ok) {
        onSuccess?.();
        resetForm();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to book appointment');
      }
    } catch (error) {
      setError('Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setSelectedDepartment(null);
    setSelectedDoctor(null);
    setSelectedDate('');
    setSelectedTime('');
    setReason('');
    setTimeSlots([]);
    setError('');
  };

  const getMinDate = () => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split('T')[0];
  };

  const getMaxDate = () => {
    const maxDate = new Date();
    maxDate.setMonth(maxDate.getMonth() + 3);
    return maxDate.toISOString().split('T')[0];
  };

  return (
    <div className="max-w-2xl mx-auto">
      <div className="mb-6">
        <div className="flex items-center">
          {[1, 2, 3, 4].map((stepNumber) => (
            <div key={stepNumber} className="flex items-center">
              <div className={`
                w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium
                ${step >= stepNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'}
              `}>
                {stepNumber}
              </div>
              {stepNumber < 4 && (
                <div className={`w-16 h-1 ${step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'}`} />
              )}
            </div>
          ))}
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Step {step}: {['Select Department', 'Choose Doctor', 'Pick Date & Time', 'Confirm'][step - 1]}
        </div>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
          <div className="text-red-800">{error}</div>
        </div>
      )}

      {/* Step 1: Select Department */}
      {step === 1 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Select Department</h3>
          <div className="grid gap-3">
            {departments.map((dept) => (
              <div
                key={dept.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedDepartment?.id === dept.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedDepartment(dept)}
              >
                <h4 className="font-medium">{dept.name}</h4>
                <p className="text-sm text-gray-600">{dept.doctors.length} doctors available</p>
              </div>
            ))}
          </div>
          <Button
            onClick={() => setStep(2)}
            disabled={!selectedDepartment}
            className="w-full"
          >
            Next
          </Button>
        </div>
      )}

      {/* Step 2: Choose Doctor */}
      {step === 2 && selectedDepartment && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Choose Doctor</h3>
          <div className="grid gap-3">
            {selectedDepartment.doctors.map((doctor) => (
              <div
                key={doctor.id}
                className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                  selectedDoctor?.id === doctor.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-gray-300'
                }`}
                onClick={() => setSelectedDoctor(doctor)}
              >
                <h4 className="font-medium">Dr. {doctor.firstName} {doctor.lastName}</h4>
                <p className="text-sm text-gray-600">{doctor.specialization}</p>
                <p className="text-sm text-gray-600">{doctor.experience} years experience</p>
                <p className="text-sm font-medium text-green-600">₹{doctor.consultationFee}</p>
              </div>
            ))}
          </div>
          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(1)} className="flex-1">
              Back
            </Button>
            <Button onClick={() => setStep(3)} disabled={!selectedDoctor} className="flex-1">
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Step 3: Pick Date & Time */}
      {step === 3 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Pick Date & Time</h3>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Appointment Date
            </label>
            <Input
              type="date"
              value={selectedDate}
              onChange={(e) => setSelectedDate(e.target.value)}
              min={getMinDate()}
              max={getMaxDate()}
            />
          </div>

          {selectedDate && timeSlots.length > 0 && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Available Time Slots
              </label>
              <div className="grid grid-cols-3 gap-2">
                {timeSlots.map((slot) => (
                  <button
                    key={slot.time}
                    type="button"
                    disabled={!slot.available}
                    className={`p-2 text-sm border rounded ${
                      selectedTime === slot.time
                        ? 'bg-blue-600 text-white border-blue-600'
                        : slot.available
                        ? 'border-gray-300 hover:border-gray-400'
                        : 'border-gray-200 bg-gray-100 text-gray-400 cursor-not-allowed'
                    }`}
                    onClick={() => setSelectedTime(slot.time)}
                  >
                    {slot.time}
                  </button>
                ))}
              </div>
            </div>
          )}

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(2)} className="flex-1">
              Back
            </Button>
            <Button 
              onClick={() => setStep(4)} 
              disabled={!selectedDate || !selectedTime} 
              className="flex-1"
            >
              Next
            </Button>
          </div>
        </div>
      )}

      {/* Step 4: Confirm & Reason */}
      {step === 4 && (
        <div className="space-y-4">
          <h3 className="text-lg font-medium">Confirm Appointment</h3>
          
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium mb-2">Appointment Details</h4>
            <div className="space-y-1 text-sm">
              <p><span className="font-medium">Department:</span> {selectedDepartment?.name}</p>
              <p><span className="font-medium">Doctor:</span> Dr. {selectedDoctor?.firstName} {selectedDoctor?.lastName}</p>
              <p><span className="font-medium">Date:</span> {new Date(selectedDate).toLocaleDateString()}</p>
              <p><span className="font-medium">Time:</span> {selectedTime}</p>
              <p><span className="font-medium">Fee:</span> ₹{selectedDoctor?.consultationFee}</p>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Reason for Visit *
            </label>
            <textarea
              className="w-full p-3 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              rows={3}
              value={reason}
              onChange={(e) => setReason(e.target.value)}
              placeholder="Please describe your symptoms or reason for the appointment..."
              required
            />
          </div>

          <div className="flex gap-2">
            <Button variant="outline" onClick={() => setStep(3)} className="flex-1">
              Back
            </Button>
            <Button 
              onClick={handleSubmit} 
              disabled={loading || !reason.trim()} 
              className="flex-1"
            >
              {loading ? 'Booking...' : 'Book Appointment'}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}