import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: { doctorId: string } }
) {
  try {
    const { searchParams } = new URL(request.url);
    const date = searchParams.get('date');

    if (!date) {
      return NextResponse.json(
        { error: 'Date parameter is required' },
        { status: 400 }
      );
    }

    const doctorId = params.doctorId;
    
    // Check if doctor exists
    const doctor = await prisma.doctor.findUnique({
      where: { id: doctorId }
    });

    if (!doctor) {
      return NextResponse.json(
        { error: 'Doctor not found' },
        { status: 404 }
      );
    }

    // Get existing appointments for the date
    const existingAppointments = await prisma.appointment.findMany({
      where: {
        doctorId,
        appointmentDate: new Date(date),
        status: {
          not: 'CANCELLED'
        }
      },
      select: {
        appointmentTime: true
      }
    });

    // Generate time slots (9 AM to 5 PM, 30-minute slots)
    const timeSlots = [];
    const startHour = 9;
    const endHour = 17;
    const slotDuration = 30; // minutes

    for (let hour = startHour; hour < endHour; hour++) {
      for (let minute = 0; minute < 60; minute += slotDuration) {
        const timeString = `${hour.toString().padStart(2, '0')}:${minute.toString().padStart(2, '0')}`;
        const isBooked = existingAppointments.some(apt => apt.appointmentTime === timeString);
        
        timeSlots.push({
          time: timeString,
          available: !isBooked
        });
      }
    }

    return NextResponse.json({
      doctorId,
      date,
      slots: timeSlots
    });
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
    return NextResponse.json(
      { error: 'Failed to fetch availability' },
      { status: 500 }
    );
  }
}