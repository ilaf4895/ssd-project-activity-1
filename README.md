# Smart University Transport Management System — Activity 1

## Pages
- `index.html` — public landing page
- `signup.html` — Day Scholar / Hostelite student registration
- `login.html` — student login
- `student-dashboard.html` — role-aware student portal
- `admin-login.html` — restricted admin login
- `admin-dashboard.html` — route, bus and route-assignment management

## Local browser storage
All prototype data is stored in `localStorage` under:
` sutms_activity1_v2 `

This includes:
- student accounts
- current login session
- routes and route stops
- buses and route assignments
- reservations
- attendance
- announcements

This is intentionally a frontend prototype. Passwords and data stored in localStorage are NOT suitable for a real production system.

## Demo admin
Email: `admin@transport.local`
Password: `admin123`

## Flow
Home → Student Signup/Login → Student Dashboard
Home → Admin Login → Admin Dashboard

The student dashboard only shows the student role view. The admin dashboard is separate and provides management functions.
