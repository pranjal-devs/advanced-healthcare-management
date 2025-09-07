import { UserRole } from '@prisma/client'

export interface LoginCredentials {
  email: string
  password: string
}

export interface SignUpData {
  email: string
  password: string
  confirmPassword: string
  role: UserRole
  firstName: string
  lastName: string
  phoneNumber?: string
  
  // Patient specific fields
  dateOfBirth?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  address?: string
  city?: string
  emergencyContact?: string
  
  // Doctor specific fields
  specialization?: string
  licenseNumber?: string
  experience?: number
  consultationFee?: number
  departmentId?: string
}

export interface AuthResponse {
  success: boolean
  error?: string
  user?: {
    id: string
    email: string
    role: UserRole
  }
}

export interface UserProfile {
  id: string
  firstName: string
  lastName: string
}

export interface AuthUser {
  id: string
  email: string
  role: UserRole
  profile?: UserProfile
}

export interface SessionUser extends AuthUser {
  // Add any additional session-specific fields if needed
}