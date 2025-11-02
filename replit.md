# Electrocom ERP Console

## Overview
A comprehensive Next.js admin console frontend for the Electrocom ERP system. This is a full-featured admin panel for managing electrical contracting business operations including clients, AMCs, tenders, projects, tasks, employees, payroll, and more.

## Tech Stack
- **Framework**: Next.js 14+ (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS
- **Icons**: Lucide React
- **Form Management**: React Hook Form with Zod validation
- **State Management**: Zustand
- **Date Utilities**: date-fns

## Project Structure
```
electrocom-console/
├── app/                          # Next.js App Router pages
│   ├── dashboard/                # Dashboard overview
│   ├── documents/                # Document management
│   ├── clients/                  # Client master
│   ├── amcs/                     # AMC management
│   ├── tenders/                  # Tender management
│   ├── projects/                 # Project management
│   ├── tasks/                    # Task tracking
│   ├── employees/                # Employee management
│   ├── contract-workers/         # Contract worker management
│   ├── attendance/               # Attendance tracking
│   ├── payroll/                  # Payroll management
│   ├── resources/                # Resource inventory
│   ├── task-resources/           # Task resource consumption
│   ├── reports/                  # Reports & analytics
│   ├── notifications/            # Notification center
│   ├── email-templates/          # Email template management
│   ├── bank-accounts/            # Bank account management
│   ├── holiday-calendar/         # Holiday calendar
│   └── settings/                 # System settings
├── components/
│   ├── layout/                   # Layout components (Sidebar, Header, DashboardLayout)
│   ├── providers/                # Context providers (ThemeProvider)
│   └── ui/                       # Reusable UI components
├── lib/                          # Utility functions
└── types/                        # TypeScript type definitions

## Features

### Global Layout
- **Collapsible Sidebar**: 19 module links organized by category
- **Header**: Page title, breadcrumbs, global search, notification bell (with unread count), theme toggle, user avatar dropdown
- **Theme Support**: Light/dark mode with persistent storage
- **Responsive Design**: Mobile-optimized with collapsible sidebar

### Core Modules (Implemented)
1. **Dashboard**: Overview cards, quick actions, AMC expiry alerts, recent activity
2. **Documents**: Complete document management with upload, version control, preview, bulk operations, grid/table views
3. **Clients**: Client master with CRUD interface, searchable table
4. **AMCs**: AMC management with status tracking, billing cycle support
5. **Tenders**: Tender pipeline with EMD tracking
6. **Projects**: Project listing with status badges
7. **Tasks, Employees, Contract Workers, Attendance, Payroll, Resources, Task Resources, Reports, Notifications, Email Templates, Bank Accounts, Holiday Calendar, Settings**: Placeholder pages ready for implementation

### UI Components
- Button (multiple variants and sizes)
- Card (with header, content, footer)
- Badge (status indicators)
- Input (form inputs)
- Label (form labels)
- Theme toggle (light/dark mode)

## Database Schema Reference
The frontend is designed to match the database schema provided in the requirements. All data structures align with the Django backend schema including:
- Client, AMC, AMCBilling, Tender, TenderDeposit
- Employee, ContractWorker, Project, Task, TaskResource
- Attendance, PayrollRecord, Resource
- Notification, EmailTemplate, DocumentTemplate, BankAccount, HolidayCalendar

## Current Status
- ✅ Project setup with Next.js 14, TypeScript, and Tailwind CSS
- ✅ Global layout with collapsible sidebar and header
- ✅ Theme provider with light/dark mode
- ✅ Reusable UI components
- ✅ Dashboard with overview cards and quick actions
- ✅ Client, AMC, and Tender modules with data tables
- ✅ All 19 module pages created (some with full implementation, others with placeholders)
- ✅ Responsive design ready

## Next Steps
1. Integrate Django REST API endpoints for all CRUD operations
2. Implement detailed forms for creating/editing records
3. Add advanced filtering, sorting, and export functionality
4. Create data visualizations and charts for reports
5. Implement real-time notifications using WebSocket
6. Add authentication with role-based access control
7. Complete all placeholder modules with full functionality

## Development
- **Dev Server**: `npm run dev` (runs on port 5000)
- **Build**: `npm run build`
- **Start Production**: `npm start`

## Design Tokens
- **Primary Accent**: sky-500 (for interactive elements, buttons, links)
- **Card Style**: White background with `rounded-lg border border-gray-200 shadow-sm`, hover effect with `hover:shadow-md`
- **Icon Containers**: Gray background `bg-gray-50 border border-gray-200` with gray icons `text-gray-500`
- **Category Badges**: `bg-gray-100 text-gray-700` with rounded-full or rounded styling
- **Background**: Neutral gray (light mode: white cards on gray background, dark mode: gray-900)
- **Typography**: System fonts with clear hierarchy
- **Color Philosophy**: Clean, minimal aesthetic with white backgrounds, gray neutrals, and sky-500 accent only for interactive elements

## Notes
- All forms and data structures match the provided database schema
- Frontend uses mock data and is ready for Django API integration
- Theme preference persists in localStorage
- Mobile navigation collapses sidebar to icons
