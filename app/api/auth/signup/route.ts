import { NextRequest, NextResponse } from 'next/server'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'
import { UserRole } from '@prisma/client'

interface SignUpRequest {
  email: string
  password: string
  role: UserRole
  firstName: string
  lastName: string
  phoneNumber?: string
  // Additional fields based on role
  dateOfBirth?: string
  gender?: 'MALE' | 'FEMALE' | 'OTHER'
  address?: string
  city?: string
  emergencyContact?: string
  specialization?: string
  licenseNumber?: string
  experience?: number
  consultationFee?: number
  departmentId?: string
}

export async function POST(req: NextRequest) {
  try {
    const body: SignUpRequest = await req.json()
    
    const {
      email,
      password,
      role,
      firstName,
      lastName,
      phoneNumber,
      dateOfBirth,
      gender,
      address,
      city,
      emergencyContact,
      specialization,
      licenseNumber,
      experience,
      consultationFee,
      departmentId
    } = body

    // Validate required fields
    if (!email || !password || !role || !firstName || !lastName) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      )
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({
      where: { email }
    })

    if (existingUser) {
      return NextResponse.json(
        { error: 'User already exists' },
        { status: 409 }
      )
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10)

    // Create user with transaction to ensure data consistency
    const result = await prisma.$transaction(async (tx) => {
      // Create base user
      const user = await tx.user.create({
        data: {
          email,
          password: hashedPassword,
          role,
          isActive: true
        }
      })

      // Create role-specific profile
      switch (role) {
        case 'PATIENT':
          if (!dateOfBirth || !gender || !address || !city || !emergencyContact) {
            throw new Error('Missing required patient fields')
          }
          
          await tx.patient.create({
            data: {
              userId: user.id,
              firstName,
              lastName,
              dateOfBirth: new Date(dateOfBirth),
              gender,
              phoneNumber: phoneNumber || '',
              address,
              city,
              emergencyContact
            }
          })
          break

        case 'DOCTOR':
          if (!specialization || !licenseNumber || !experience || !consultationFee || !departmentId) {
            throw new Error('Missing required doctor fields')
          }

          // Check if license number already exists
          const existingDoctor = await tx.doctor.findUnique({
            where: { licenseNumber }
          })

          if (existingDoctor) {
            throw new Error('License number already exists')
          }

          // Verify department exists
          const department = await tx.department.findUnique({
            where: { id: departmentId }
          })

          if (!department) {
            throw new Error('Department not found')
          }

          await tx.doctor.create({
            data: {
              userId: user.id,
              firstName,
              lastName,
              specialization,
              licenseNumber,
              phoneNumber: phoneNumber || '',
              experience,
              consultationFee,
              departmentId
            }
          })
          break

        case 'ADMIN':
          await tx.admin.create({
            data: {
              userId: user.id,
              firstName,
              lastName,
              phoneNumber: phoneNumber || ''
            }
          })
          break

        default:
          throw new Error('Invalid role')
      }

      return user
    })

    return NextResponse.json(
      { 
        message: 'User created successfully',
        user: {
          id: result.id,
          email: result.email,
          role: result.role
        }
      },
      { status: 201 }
    )

  } catch (error) {
    console.error('Signup error:', error)
    
    if (error instanceof Error) {
      return NextResponse.json(
        { error: error.message },
        { status: 400 }
      )
    }

    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}