'use client';

import { Card, CardContent } from '@/components/ui/Card';
import { LoadingSpinner } from '@/components/ui/LoadingSpinner';
import type { DashboardStats } from '@/types/dashboard';

// Icons
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

const ClockIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CheckCircleIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const CurrencyIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
  </svg>
);

const DocumentIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
  </svg>
);

const TrendingUpIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
  </svg>
);

const TrendingDownIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 17h8m0 0V9m0 8l-8-8-4 4-6-6" />
  </svg>
);

interface StatCardProps {
  title: string;
  value: string | number;
  change?: {
    value: number;
    type: 'increase' | 'decrease';
  };
  icon: React.ComponentType<{ className?: string }>;
  color: 'blue' | 'green' | 'yellow' | 'purple' | 'red' | 'indigo';
}

const StatCard = ({ title, value, change, icon: Icon, color }: StatCardProps) => {
  const colorClasses = {
    blue: 'bg-blue-50 text-blue-600',
    green: 'bg-green-50 text-green-600',
    yellow: 'bg-yellow-50 text-yellow-600',
    purple: 'bg-purple-50 text-purple-600',
    red: 'bg-red-50 text-red-600',
    indigo: 'bg-indigo-50 text-indigo-600'
  };

  return (
    <Card>
      <CardContent className="p-6">
        <div className="flex items-center">
          <div className={`rounded-lg p-3 ${colorClasses[color]}`}>
            <Icon className="h-6 w-6" />
          </div>
          <div className="ml-4 flex-1">
            <p className="text-sm font-medium text-gray-600">{title}</p>
            <div className="flex items-baseline">
              <p className="text-2xl font-semibold text-gray-900">{value}</p>
              {change && (
                <div className={`ml-2 flex items-center text-sm ${
                  change.type === 'increase' ? 'text-green-600' : 'text-red-600'
                }`}>
                  {change.type === 'increase' ? (
                    <TrendingUpIcon className="h-4 w-4 mr-1" />
                  ) : (
                    <TrendingDownIcon className="h-4 w-4 mr-1" />
                  )}
                  {Math.abs(change.value)}%
                </div>
              )}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface StatsCardsProps {
  stats?: DashboardStats;
  isLoading?: boolean;
  userRole?: string;
}

export const StatsCards = ({ stats, isLoading, userRole }: StatsCardsProps) => {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <Card key={i}>
            <CardContent className="p-6">
              <div className="flex items-center justify-center h-16">
                <LoadingSpinner size="md" />
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    );
  }

  if (!stats) {
    return null;
  }

  // Define stat cards based on user role
  const getStatCards = () => {
    const baseCards = [
      {
        title: 'Total Patients',
        value: stats.totalPatients.toLocaleString(),
        icon: UsersIcon,
        color: 'blue' as const,
        change: { value: 12, type: 'increase' as const }
      },
      {
        title: 'Total Appointments',
        value: stats.totalAppointments.toLocaleString(),
        icon: CalendarIcon,
        color: 'green' as const,
        change: { value: 8, type: 'increase' as const }
      },
      {
        title: 'Today\'s Appointments',
        value: stats.todayAppointments.toLocaleString(),
        icon: ClockIcon,
        color: 'yellow' as const
      },
      {
        title: 'Completed Appointments',
        value: stats.completedAppointments.toLocaleString(),
        icon: CheckCircleIcon,
        color: 'purple' as const,
        change: { value: 5, type: 'increase' as const }
      }
    ];

    if (userRole === 'ADMIN') {
      return [
        ...baseCards,
        {
          title: 'Total Doctors',
          value: stats.totalDoctors.toLocaleString(),
          icon: UserIcon,
          color: 'indigo' as const,
          change: { value: 3, type: 'increase' as const }
        },
        {
          title: 'Total Revenue',
          value: `₹${stats.totalRevenue.toLocaleString()}`,
          icon: CurrencyIcon,
          color: 'green' as const,
          change: { value: 15, type: 'increase' as const }
        },
        {
          title: 'Pending Bills',
          value: stats.pendingBills.toLocaleString(),
          icon: DocumentIcon,
          color: 'red' as const,
          change: { value: 2, type: 'decrease' as const }
        }
      ].slice(0, 6); // Show 6 cards for admin
    }

    if (userRole === 'DOCTOR') {
      return [
        {
          title: 'My Patients',
          value: stats.totalPatients.toLocaleString(),
          icon: UsersIcon,
          color: 'blue' as const
        },
        {
          title: 'Today\'s Appointments',
          value: stats.todayAppointments.toLocaleString(),
          icon: ClockIcon,
          color: 'green' as const
        },
        {
          title: 'Pending Appointments',
          value: stats.pendingAppointments.toLocaleString(),
          icon: CalendarIcon,
          color: 'yellow' as const
        },
        {
          title: 'Completed Today',
          value: stats.completedAppointments.toLocaleString(),
          icon: CheckCircleIcon,
          color: 'purple' as const
        }
      ];
    }

    if (userRole === 'PATIENT') {
      return [
        {
          title: 'My Appointments',
          value: stats.totalAppointments.toLocaleString(),
          icon: CalendarIcon,
          color: 'blue' as const
        },
        {
          title: 'Upcoming',
          value: stats.pendingAppointments.toLocaleString(),
          icon: ClockIcon,
          color: 'green' as const
        },
        {
          title: 'Completed',
          value: stats.completedAppointments.toLocaleString(),
          icon: CheckCircleIcon,
          color: 'purple' as const
        },
        {
          title: 'Medical Records',
          value: '12', // This would come from API
          icon: DocumentIcon,
          color: 'indigo' as const
        }
      ];
    }

    return baseCards.slice(0, 4);
  };

  const statCards = getStatCards();

  return (
    <div className={`grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${Math.min(statCards.length, 4)} gap-6`}>
      {statCards.map((card, index) => (
        <StatCard key={index} {...card} />
      ))}
    </div>
  );
};