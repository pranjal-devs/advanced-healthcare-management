# ADVANCED HEALTHCARE MANAGEMENT SYSTEM - Next.JS Typescript PrismaORM TailwindCSS PostgresSQL  

# 🗄️ Database Setup – Healthcare Management System  

This project uses a **relational database** designed for scalability and data integrity.  
The schema currently consists of **12 main entities** and several enum types to enforce data consistency.

## 📊 Database Design week-1

- **Relational Model** – Follows 1:1, 1:N, and M:N relationships.  
- **Central Authentication** – `User` table with role-based access (`Patient`, `Doctor`, `Admin`).  
- **Patient & Doctor** – Linked to core medical data:
  - Appointments  
  - Medical Records  
  - Prescriptions  
- **Departments** – Organize doctors by specialization.  
- **Billing System** – `Billing` and `BillingItem` tables provide structured invoicing.  
- **PrescriptionMedication** – Junction table to manage prescriptions and medications (with dosage details).  

## 🛠️ Tech Stack for DB  
- **Prisma ORM** for schema definition and database migrations.  
- **PostgreSQL** (or MySQL) as the relational database.  

# 🔐 Authentication & Authorization – Healthcare Management System  week-2

I implemented a **secure authentication system** for the project:

- Integrated **NextAuth.js** with **JWT-based sessions** for scalable stateless auth.  
- Built **multi-role authentication** (Patient, Doctor, Admin) with protected routes.  
- Added **role-based middleware** to restrict sensitive API endpoints.  
- Created **signup & signin forms** with role-specific validation (extra fields for doctors).  
- Developed **API routes** for user registration and department management.  
- Implemented **custom auth hooks** for easy session handling in the frontend.  
- Added **session management UI** (login/logout state awareness).  
- Ensured smooth redirect flow after login based on user role.  
- Security-first design: hashed passwords, safe JWT storage, and CSRF protection.  

# 📊 Dashboard Development – week-3   

- Built a **role-based dashboard UI** for Admin, Doctors, and Patients.  
- Integrated **PostgreSQL (Neon.db)** to display **real-time data** across dashboards.  
- Created **layout components** (`Header.tsx`, `Sidebar.tsx`) for consistent navigation and structure.  
- Developed **reusable UI components** (`Button`, `Alert`, `Card`, `Input`, `LoadingSpinner`) with TypeScript interfaces.  
- Set up **API route structure** under `/api/dashboard/`:  
  - `recentAppointments/route.ts` → Fetches latest appointment data  
  - `stats/route.ts` → Provides dashboard statistics and metrics  
  - `departments/route.ts` → Manages department-related data  
- Added **error handling** and **server-side data processing** for reliable dashboard updates.  
