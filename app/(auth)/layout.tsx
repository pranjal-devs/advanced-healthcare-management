import { ReactNode } from 'react'

interface AuthLayoutProps {
  children: ReactNode
}

export default function AuthLayout({ children }: AuthLayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="absolute top-4 left-4">
        <h2 className="text-2xl font-bold text-blue-600">Healthcare Management</h2>
      </div>
      {children}
    </div>
  )
}