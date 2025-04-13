Leave Management System

Goal:
Build a simple web app where employees can apply for leaves and admins can manage requests.

Requirements:

1. User Roles:
   - Employee
   - Admin
   (You can hardcode login or use a toggle to switch roles)

2. Employee Panel:
   - Apply for leave with:
     ▪ Name / Employee ID
     ▪ From Date – To Date
     ▪ Reason
     ▪ Type of Leave (Casual, Sick, Emergency) – optional dropdown
   - View status of previously applied leaves:
     ▪ Pending
     ▪ Approved
     ▪ Rejected

3. Admin Panel:
   - View all leave requests
   - Filter leave requests by:
     ▪ Employee name
     ▪ Date range
     ▪ Leave status
   - Approve / Reject requests
     ▪ With optional comment

4. UI Requirements:
   - Clear distinction between employee and admin view
   - Proper form validations

Bonus Features:
- Leave count limit validation (e.g., no more than 12 sick leaves per year)
- Sort leave requests by most recent or oldest
