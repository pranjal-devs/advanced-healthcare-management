// prisma/seed.ts
import { PrismaClient } from '@prisma/client'
import bcrypt from 'bcryptjs'

const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Starting seed...')

  // Create Departments
  const cardiology = await prisma.department.create({
    data: {
      name: 'Cardiology',
      description: 'Heart and cardiovascular system',
      location: 'Building A, Floor 2',
      phoneNumber: '+1-555-0101',
    },
  })

  const orthopedics = await prisma.department.create({
    data: {
      name: 'Orthopedics',
      description: 'Bone and joint care',
      location: 'Building B, Floor 1',
      phoneNumber: '+1-555-0102',
    },
  })

  const pediatrics = await prisma.department.create({
    data: {
      name: 'Pediatrics',
      description: 'Children healthcare',
      location: 'Building C, Floor 1',
      phoneNumber: '+1-555-0103',
    },
  })

  // Create Admin User
  const adminPassword = await bcrypt.hash('admin123', 10)
  const adminUser = await prisma.user.create({
    data: {
      email: 'admin@healthcare.com',
      password: adminPassword,
      role: 'ADMIN',
      admin: {
        create: {
          firstName: 'System',
          lastName: 'Administrator',
          phoneNumber: '+1-555-0001',
        },
      },
    },
  })

  // Create Sample Doctor
  const doctorPassword = await bcrypt.hash('doctor123', 10)
  const doctorUser = await prisma.user.create({
    data: {
      email: 'dr.smith@healthcare.com',
      password: doctorPassword,
      role: 'DOCTOR',
      doctor: {
        create: {
          firstName: 'John',
          lastName: 'Smith',
          specialization: 'Cardiologist',
          licenseNumber: 'MD123456',
          phoneNumber: '+1-555-1001',
          experience: 10,
          consultationFee: 150.00,
          departmentId: cardiology.id,
        },
      },
    },
  })

  // Create Sample Patient
  const patientPassword = await bcrypt.hash('patient123', 10)
  const patientUser = await prisma.user.create({
    data: {
      email: 'jane.doe@email.com',
      password: patientPassword,
      role: 'PATIENT',
      patient: {
        create: {
          firstName: 'Jane',
          lastName: 'Doe',
          dateOfBirth: new Date('1990-05-15'),
          gender: 'FEMALE',
          phoneNumber: '+1-555-2001',
          address: '123 Main Street',
          city: 'New York',
          bloodType: 'O_POSITIVE',
          allergies: 'Peanuts, Shellfish',
          emergencyContact: '+1-555-2002',
        },
      },
    },
  })

  // Create Sample Medications
  await prisma.medication.createMany({
    data: [
      {
        name: 'Paracetamol',
        genericName: 'Acetaminophen',
        dosageForm: 'tablet',
        strength: '500mg',
        price: 5.99,
      },
      {
        name: 'Amoxicillin',
        genericName: 'Amoxicillin',
        dosageForm: 'capsule',
        strength: '250mg',
        price: 12.50,
      },
      {
        name: 'Ibuprofen',
        genericName: 'Ibuprofen',
        dosageForm: 'tablet',
        strength: '400mg',
        price: 8.75,
      },
    ],
  })

  console.log('✅ Seed completed!')
  console.log('📧 Admin: admin@healthcare.com / admin123')
  console.log('👨‍⚕️ Doctor: dr.smith@healthcare.com / doctor123')
  console.log('👤 Patient: jane.doe@email.com / patient123')
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })