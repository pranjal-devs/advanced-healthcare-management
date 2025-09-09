import { NextRequest, NextResponse } from 'next/server';
// import { getToken } from 'next-auth/jwt';

export async function authMiddleware(request: NextRequest) {
  try {
    // Uncomment when you have NextAuth properly set up
    // const token = await getToken({ 
    //   req: request, 
    //   secret: process.env.NEXTAUTH_SECRET 
    // });

    // For now, we'll use a simple check - replace this with your auth logic
    const authHeader = request.headers.get('authorization');
    const sessionCookie = request.cookies.get('next-auth.session-token');
    
    // Temporary auth check - replace with your actual auth logic
    const isAuthenticated = authHeader || sessionCookie;
    
    if (!isAuthenticated) {
      return NextResponse.json(
        { error: 'Authentication required' },
        { status: 401 }
      );
    }

    return NextResponse.next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    return NextResponse.json(
      { error: 'Authentication error' },
      { status: 500 }
    );
  }
}

// Role-based access control middleware
export function roleGuard(allowedRoles: string[]) {
  return async (request: NextRequest) => {
    try {
      // Get user role from token/session
      // const token = await getToken({ req: request });
      // const userRole = token?.role;
      
      // Temporary - you'll get this from your session
      const userRole = request.headers.get('x-user-role') || 'PATIENT';
      
      if (!allowedRoles.includes(userRole)) {
        return NextResponse.json(
          { error: 'Insufficient permissions' },
          { status: 403 }
        );
      }
      
      return NextResponse.next();
    } catch (error) {
      console.error('Role guard error:', error);
      return NextResponse.json(
        { error: 'Authorization error' },
        { status: 500 }
      );
    }
  };
}

// Utility function to check if user has required role
export function hasRole(userRole: string, requiredRoles: string[]): boolean {
  return requiredRoles.includes(userRole);
}

// Utility function to get user permissions based on role
export function getUserPermissions(role: string) {
  const permissions = {
    ADMIN: [
      'manage:users',
      'manage:doctors',
      'manage:patients',
      'manage:appointments',
      'manage:departments',
      'manage:billing',
      'manage:medications',
      'view:reports',
      'manage:system'
    ],
    DOCTOR: [
      'view:patients',
      'manage:appointments',
      'manage:medical-records',
      'manage:prescriptions',
      'view:medications',
      'view:own-schedule'
    ],
    PATIENT: [
      'view:own-profile',
      'view:own-appointments',
      'view:own-medical-records',
      'view:own-prescriptions',
      'view:own-billing',
      'book:appointments'
    ]
  };

  return permissions[role as keyof typeof permissions] || [];
}

// Check if user has specific permission
export function hasPermission(userRole: string, permission: string): boolean {
  const userPermissions = getUserPermissions(userRole);
  return userPermissions.includes(permission);
}