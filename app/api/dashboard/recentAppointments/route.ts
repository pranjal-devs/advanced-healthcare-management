import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
// import { getServerSession } from 'next-auth/next';
// import { authOptions } from '@/app/api/auth/[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    // Uncomment when you have your auth setup ready
    // const session = await getServerSession(authOptions);
    // if (!session) {
    //   return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    // }

    const { searchParams } = new URL(request.url);
    const limit = parseInt(searchParams.get('limit') || '10');
    const userRole = searchParams.get('userRole');
    const userId = searchParams.get('userId');

    let whereClause = {};
    let orderBy = {};

    // Customize query based on user role
    if (userRole === 'DOCTOR' && userId) {
      whereClause = {
        doctorId: userId,
        appointmentDate: {
          gte: new Date(), // Only upcoming appointments for doctors
        },
      };
      orderBy = {
        appointmentDate: 'asc',
      };
    } else if (userRole === 'PATIENT' && userId) {
      whereClause = {
        patientId: userId,
        status: {
          in: ['SCHEDULED', 'CONFIRMED'], // Only upcoming appointments for patients
        },
      };
      orderBy = {
        appointmentDate: 'asc',
      };
    } else {
      // Admin or default - show recent appointments
      orderBy = {
        createdAt: 'desc',
      };
    }

    const appointments = await prisma.appointment.findMany({
      where: whereClause,
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
        doctor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            specialization: true,
          },
        },
      },
      orderBy,
      take: limit,
    });

    return NextResponse.json(appointments);
  } catch (error) {
    console.error('Error fetching recent appointments:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}