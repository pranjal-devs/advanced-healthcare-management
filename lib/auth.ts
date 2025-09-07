import { NextAuthOptions } from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import { PrismaAdapter } from '@auth/prisma-adapter'
import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { UserRole } from '@prisma/client'

declare module 'next-auth' {
  interface Session {
    user: {
      id: string
      email: string
      role: UserRole
      profile?: {
        id: string
        firstName: string
        lastName: string
      }
    }
  }

  interface User {
    id: string
    email: string
    role: UserRole
    profile?: {
      id: string
      firstName: string
      lastName: string
    }
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string
    role: UserRole
    profile?: {
      id: string
      firstName: string
      lastName: string
    }
  }
}

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma) as any,
  providers: [
    CredentialsProvider({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error('Missing credentials')
        }

        try {
          // Find user with related profile data
          const user = await prisma.user.findUnique({
            where: { email: credentials.email },
            include: {
              patient: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              },
              doctor: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              },
              admin: {
                select: {
                  id: true,
                  firstName: true,
                  lastName: true
                }
              }
            }
          })

          if (!user || !user.isActive) {
            throw new Error('Invalid credentials or account disabled')
          }

          // Verify password
          const isPasswordValid = await bcrypt.compare(credentials.password, user.password)
          if (!isPasswordValid) {
            throw new Error('Invalid credentials')
          }

          // Get profile based on role
          let profile = null
          switch (user.role) {
            case 'PATIENT':
              profile = user.patient
              break
            case 'DOCTOR':
              profile = user.doctor
              break
            case 'ADMIN':
              profile = user.admin
              break
          }

          return {
            id: user.id,
            email: user.email,
            role: user.role,
            profile: profile ? {
              id: profile.id,
              firstName: profile.firstName,
              lastName: profile.lastName
            } : undefined
          }
        } catch (error) {
          console.error('Auth error:', error)
          throw new Error('Authentication failed')
        }
      }
    })
  ],
  session: {
    strategy: 'jwt',
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  jwt: {
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
        token.profile = user.profile
      }
      return token
    },
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id
        session.user.role = token.role
        session.user.profile = token.profile
      }
      return session
    }
  },
  pages: {
    signIn: '/signin',
    signOut: '/signin',
    error: '/signin'
  },
  secret: process.env.NEXTAUTH_SECRET,
}