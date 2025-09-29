import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
try {
const { searchParams } = new URL(request.url);
const patientId = searchParams.get('patientId');
const doctorId = searchParams.get('doctorId');
const status = searchParams.get('status');

const where: any = {};
if (patientId) where.patientId = patientId;
if (doctorId) where.doctorId = doctorId;
if (status) where.status = status;

const appointments = await prisma.appointment.findMany({
    where,
    include: {
    patient: {
        select: {
        firstName: true,
        lastName: true,
        phoneNumber: true,
        }
    },
    doctor: {
        select: {
        firstName: true,
        lastName: true,
        specialization: true,
        consultationFee: true,
        department: {
            select: {
            name: true
            }
        }
        }
    }
    },
    orderBy: {
    appointmentDate: 'desc'
    }
});

return NextResponse.json(appointments);
} catch (error) {
console.error('Error fetching appointments:', error);
return NextResponse.json(
    { error: 'Failed to fetch appointments' },
    { status: 500 }
);
}
}

export async function POST(request: NextRequest) {
try {
const body = await request.json();
const { patientId, doctorId, appointmentDate, appointmentTime, reason } = body;

// Check if appointment slot is already taken
const existingAppointment = await prisma.appointment.findFirst({
    where: {
    doctorId,
    appointmentDate: new Date(appointmentDate),
    appointmentTime,
    status: {
        not: 'CANCELLED'
    }
    }
});

if (existingAppointment) {
    return NextResponse.json(
    { error: 'This time slot is already booked' },
    { status: 400 }
    );
}

const appointment = await prisma.appointment.create({
    data: {
    patientId,
    doctorId,
    appointmentDate: new Date(appointmentDate),
    appointmentTime,
    reason,
    status: 'SCHEDULED'
    },
    include: {
    patient: {
        select: {
        firstName: true,
        lastName: true,
        }
    },
    doctor: {
        select: {
        firstName: true,
        lastName: true,
        specialization: true,
        }
    }
    }
});

return NextResponse.json(appointment, { status: 201 });
} catch (error) {
console.error('Error creating appointment:', error);
return NextResponse.json(
    { error: 'Failed to create appointment' },
    { status: 500 }
);
}
}