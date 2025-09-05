import { prisma } from './prisma'

export async function testDatabaseConnection() {
  try {
    // Test the connection
    await prisma.$connect()
    console.log('✅ Database connected successfully!')
    
    // Count users (should be 0 initially)
    const userCount = await prisma.user.count()
    console.log(`📊 Current users in database: ${userCount}`)
    
    return { success: true, userCount }
  } catch (error) {
    console.error('❌ Database connection failed:', error)
    return { success: false, error }
  } finally {
    await prisma.$disconnect()
  }
}