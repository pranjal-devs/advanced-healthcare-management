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

    // Get current date for filtering today's appointments
    const today = new Date();
    const startOfDay = new Date(today.setHours(0, 0, 0, 0));
    const endOfDay = new Date(today.setHours(23, 59, 59, 999));

    // Fetch all stats in parallel
    const [
      totalPatients,
      totalDoctors,
      totalAppointments,
      todayAppointments,
      pendingAppointments,
      completedAppointments,
      totalRevenue,
      pendingBills
    ] = await Promise.all([
      // Total patients
      prisma.patient.count(),
      
      // Total doctors
      prisma.doctor.count(),
      
      // Total appointments
      prisma.appointment.count(),
      
      // Today's appointments
      prisma.appointment.count({
        where: {
          appointmentDate: {
            gte: startOfDay,
            lte: endOfDay,
          },
        },
      }),
      
      // Pending appointments (scheduled + confirmed)
      prisma.appointment.count({
        where: {
          status: {
            in: ['SCHEDULED', 'CONFIRMED'],
          },
        },
      }),
      
      // Completed appointments
      prisma.appointment.count({
        where: {
          status: 'COMPLETED',
        },
      }),
      
      // Total revenue from paid bills
      prisma.billing.aggregate({
        _sum: {
          paidAmount: true,
        },
        where: {
          status: 'PAID',
        },
      }),
      
      // Count of pending bills
      prisma.billing.count({
        where: {
          status: 'PENDING',
        },
      }),
    ]);

    const stats = {
      totalPatients,
      totalDoctors,
      totalAppointments,
      todayAppointments,
      pendingAppointments,
      completedAppointments,
      totalRevenue: totalRevenue._sum.paidAmount || 0,
      pendingBills,
    };

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching dashboard stats:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}

// Optional: Add role-specific stats endpoint
export async function POST(request: NextRequest) {
  try {
    const { userRole, userId } = await request.json();
    
    // You can customize stats based on user role
    let stats;
    
    if (userRole === 'DOCTOR') {
      // Doctor-specific stats
      const doctorId = userId; // Assuming you have doctor ID from session
      
      const [
        myPatients,
        myAppointmentsToday,
        myPendingAppointments,
        myCompletedAppointments
      ] = await Promise.all([
        // Fix: Use groupBy to count unique patients, or use findMany with distinct
        prisma.appointment.groupBy({
          by: ['patientId'],
          where: { doctorId },
          _count: {
            patientId: true,
          },
        }).then(result => result.length), // Count the number of unique patients
        
        prisma.appointment.count({
          where: {
            doctorId,
            appointmentDate: {
              gte: new Date(new Date().setHours(0, 0, 0, 0)),
              lte: new Date(new Date().setHours(23, 59, 59, 999)),
            },
          },
        }),
        prisma.appointment.count({
          where: {
            doctorId,
            status: { in: ['SCHEDULED', 'CONFIRMED'] },
          },
        }),
        prisma.appointment.count({
          where: {
            doctorId,
            status: 'COMPLETED',
          },
        }),
      ]);

      stats = {
        totalPatients: myPatients,
        totalDoctors: 0,
        totalAppointments: myPendingAppointments + myCompletedAppointments,
        todayAppointments: myAppointmentsToday,
        pendingAppointments: myPendingAppointments,
        completedAppointments: myCompletedAppointments,
        totalRevenue: 0,
        pendingBills: 0,
      };
    } else if (userRole === 'PATIENT') {
      // Patient-specific stats
      const patientId = userId; // Assuming you have patient ID from session
      
      const [
        myAppointments,
        myUpcomingAppointments,
        myCompletedAppointments,
        myPendingBills
      ] = await Promise.all([
        prisma.appointment.count({
          where: { patientId },
        }),
        prisma.appointment.count({
          where: {
            patientId,
            status: { in: ['SCHEDULED', 'CONFIRMED'] },
          },
        }),
        prisma.appointment.count({
          where: {
            patientId,
            status: 'COMPLETED',
          },
        }),
        prisma.billing.count({
          where: {
            patientId,
            status: 'PENDING',
          },
        }),
      ]);

      stats = {
        totalPatients: 0,
        totalDoctors: 0,
        totalAppointments: myAppointments,
        todayAppointments: 0,
        pendingAppointments: myUpcomingAppointments,
        completedAppointments: myCompletedAppointments,
        totalRevenue: 0,
        pendingBills: myPendingBills,
      };
    } else {
      // Default admin stats (same as GET)
      return GET(request);
    }

    return NextResponse.json(stats);
  } catch (error) {
    console.error('Error fetching role-specific stats:', error);
    return NextResponse.json(
      { error: 'Internal Server Error' },
      { status: 500 }
    );
  }
}