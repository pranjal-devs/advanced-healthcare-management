import { useSession, signIn, signOut } from 'next-auth/react'
import { useRouter } from 'next/navigation'
import { UserRole } from '@prisma/client'

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  profile?: {
    id: string
    firstName: string
    lastName: string
  }
}

export const useAuth = () => {
  const { data: session, status } = useSession()
  const router = useRouter()

  const user = session?.user as AuthUser | undefined

  const login = async (email: string, password: string) => {
    try {
      const result = await signIn('credentials', {
        email,
        password,
        redirect: false
      })

      if (result?.error) {
        throw new Error(result.error)
      }

      if (result?.ok) {
        router.push('/dashboard')
        return { success: true }
      }

      throw new Error('Login failed')
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Login failed'
      }
    }
  }

  const logout = async () => {
    try {
      await signOut({ redirect: false })
      router.push('/signin')
    } catch (error) {
      console.error('Logout error:', error)
    }
  }

  const isAuthenticated = status === 'authenticated'
  const isLoading = status === 'loading'

  // Role checking utilities
  const isPatient = user?.role === 'PATIENT'
  const isDoctor = user?.role === 'DOCTOR'
  const isAdmin = user?.role === 'ADMIN'

  const hasRole = (role: UserRole) => user?.role === role
  const hasAnyRole = (roles: UserRole[]) => user?.role ? roles.includes(user.role) : false

  // Profile utilities
  const getFullName = () => {
    if (user?.profile) {
      return `${user.profile.firstName} ${user.profile.lastName}`
    }
    return user?.email || 'User'
  }

  const getFirstName = () => user?.profile?.firstName || 'User'

  return {
    user,
    session,
    isAuthenticated,
    isLoading,
    isPatient,
    isDoctor,
    isAdmin,
    hasRole,
    hasAnyRole,
    getFullName,
    getFirstName,
    login,
    logout
  }
}