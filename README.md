# 🗄️ Database Setup – Healthcare Management System

This project uses a **relational database** designed for scalability and data integrity.  
The schema currently consists of **12 main entities** and several enum types to enforce data consistency.

## 📊 Database Design

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
