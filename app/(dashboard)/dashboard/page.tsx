'use client';

import { useState, useEffect } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { StatsCards } from '@/components/dashboard/StatsCards';
import { RecentAppointments } from '@/components/dashboard/RecentAppointments';
import { QuickActions } from '@/components/dashboard/QuickActions';
import type { DashboardStats, RecentAppointment } from '@/types/dashboard';

export default function DashboardPage() {
  const { user } = useAuth();
  const [stats, setStats] = useState<DashboardStats | null>(null);
  const [appointments, setAppointments] = useState<RecentAppointment[]>([]);
  const [isLoadingStats, setIsLoadingStats] = useState(true);
  const [isLoadingAppointments, setIsLoadingAppointments] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch dashboard stats
  useEffect(() => {
    const fetchStats = async () => {
      if (!user) return;

      try {
        setIsLoadingStats(true);
        setError(null);

        let response: Response;

        // Use role-specific endpoint if available
        if (user.role && ['DOCTOR', 'PATIENT'].includes(user.role)) {
          response = await fetch('/api/dashboard/stats', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              userRole: user.role,
              userId: user.id,
            }),
          });
        } else {
          response = await fetch('/api/dashboard/stats');
        }
        
        if (!response.ok) {
          throw new Error(`Failed to fetch stats: ${response.status} ${response.statusText}`);
        }
        
        const data: DashboardStats = await response.json();
        setStats(data);
      } catch (error) {
        console.error('Error fetching stats:', error);
        setError(error instanceof Error ? error.message : 'Failed to load dashboard statistics');
      } finally {
        setIsLoadingStats(false);
      }
    };

    fetchStats();
  }, [user]);

  // Fetch recent appointments
  useEffect(() => {
    const fetchAppointments = async () => {
      if (!user) return;

      try {
        setIsLoadingAppointments(true);
        const params = new URLSearchParams({
          limit: '5',
          ...(user.role && { userRole: user.role }),
          ...(user.id && { userId: user.id }),
        });
        
        const response = await fetch(`/api/dashboard/recent-appointments?${params}`);
        
        if (!response.ok) {
          throw new Error('Failed to fetch appointments');
        }
        
        const data: RecentAppointment[] = await response.json();
        setAppointments(data);
      } catch (error) {
        console.error('Error fetching appointments:', error);
        // Don't set error for appointments as it's not critical
      } finally {
        setIsLoadingAppointments(false);
      }
    };

    fetchAppointments();
  }, [user]);

  const getWelcomeMessage = () => {
    const currentHour = new Date().getHours();
    let greeting = 'Good morning';
    
    if (currentHour >= 12 && currentHour < 17) {
      greeting = 'Good afternoon';
    } else if (currentHour >= 17) {
      greeting = 'Good evening';
    }
    
    const name = user?.profile ? 
      `${user.profile.firstName} ${user.profile.lastName}` : 
      user?.email?.split('@')[0] || 'User';
    
    const roleName = user?.role === 'ADMIN' ? 'Admin' : 
                    user?.role === 'DOCTOR' ? 'Dr.' : '';
    
    return `${greeting}, ${roleName} ${name}!`;
  };

  const getSubtitle = () => {
    switch (user?.role) {
      case 'ADMIN':
        return 'Here\'s what\'s happening in your healthcare system today.';
      case 'DOCTOR':
        return 'Here\'s your schedule and patient information for today.';
      case 'PATIENT':
        return 'Keep track of your appointments and health records.';
      default:
        return 'Welcome to your healthcare dashboard.';
    }
  };

  const handleRetry = () => {
    setError(null);
    setStats(null);
    setIsLoadingStats(true);
    
    // Trigger refetch by updating a dependency (you could also extract the fetch logic)
    window.location.reload();
  };

  return (
    <div className="space-y-8">
      {/* Welcome Section */}
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 rounded-lg px-6 py-8 text-white">
        <div className="max-w-3xl">
          <h1 className="text-3xl font-bold mb-2">
            {getWelcomeMessage()}
          </h1>
          <p className="text-blue-100 text-lg">
            {getSubtitle()}
          </p>
          {user?.email && (
            <p className="text-blue-200 text-sm mt-2">
              Logged in as: {user.email}
            </p>
          )}
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex items-start">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3 flex-1">
              <h3 className="text-sm font-medium text-red-800">
                Error Loading Dashboard
              </h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
              <div className="mt-3">
                <button
                  onClick={handleRetry}
                  className="bg-red-100 hover:bg-red-200 text-red-800 px-3 py-1 rounded text-sm font-medium transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Stats Cards */}
      <StatsCards 
        stats={stats ?? undefined} 
        isLoading={isLoadingStats} 
        userRole={user?.role} 
      />

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Appointments - Takes 2 columns on large screens */}
        <div className="lg:col-span-2">
          <RecentAppointments
            appointments={appointments}
            isLoading={isLoadingAppointments}
            userRole={user?.role}
          />
        </div>

        {/* Quick Actions - Takes 1 column on large screens */}
        <div className="lg:col-span-1">
          <QuickActions userRole={user?.role} />
        </div>
      </div>

      {/* Additional Sections based on role */}
      {user?.role === 'ADMIN' && (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* System Health Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              System Health
            </h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Database Status</span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Last Backup</span>
                <span className="text-sm text-gray-900">2 hours ago</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Active Users</span>
                <span className="text-sm text-gray-900">{stats?.totalDoctors || 0} doctors</span>
              </div>
            </div>
          </div>

          {/* Recent Activity Card */}
          <div className="bg-white rounded-lg border border-gray-200 p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">
              Recent Activity
            </h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-blue-400 rounded-full"></div>
                <span className="text-gray-600">Appointment scheduled</span>
                <span className="text-gray-400">12 min ago</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-yellow-400 rounded-full"></div>
                <span className="text-gray-600">Payment received</span>
                <span className="text-gray-400">1 hour ago</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="h-2 w-2 bg-purple-400 rounded-full"></div>
                <span className="text-gray-600">New doctor added</span>
                <span className="text-gray-400">3 hours ago</span>
              </div>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'DOCTOR' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Today's Schedule Overview
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <div className="text-2xl font-bold text-blue-600">{stats?.todayAppointments || 0}</div>
              <div className="text-sm text-blue-700">Total Appointments</div>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <div className="text-2xl font-bold text-green-600">{stats?.completedAppointments || 0}</div>
              <div className="text-sm text-green-700">Completed</div>
            </div>
            <div className="text-center p-4 bg-yellow-50 rounded-lg">
              <div className="text-2xl font-bold text-yellow-600">{stats?.pendingAppointments || 0}</div>
              <div className="text-sm text-yellow-700">Pending</div>
            </div>
          </div>
        </div>
      )}

      {user?.role === 'PATIENT' && (
        <div className="bg-white rounded-lg border border-gray-200 p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">
            Your Health Summary
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Next Appointment</span>
                <span className="text-sm text-gray-900">
                  {appointments.length > 0 ? 'Scheduled' : 'None scheduled'}
                </span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Pending Bills</span>
                <span className="text-sm text-gray-900">₹{stats?.pendingBills || 0}</span>
              </div>
            </div>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Total Visits</span>
                <span className="text-sm text-gray-900">{stats?.completedAppointments || 0}</span>
              </div>
              <div className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                <span className="text-sm font-medium text-gray-600">Last Visit</span>
                <span className="text-sm text-gray-900">
                  {stats?.completedAppointments && stats.completedAppointments > 0 ? 'Recently' : 'No visits yet'}
                </span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}