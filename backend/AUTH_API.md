# Authentication & User Management Backend API (Thrishala's Scope)

This document provides complete documentation for the backend and frontend authentication components assigned to **Thrishala**:

1. **User Database Model**
2. **Customer Sign Up API**
3. **Customer and Admin Login API**
4. **Password Hashing**
5. **Authentication and Role Middleware**
6. **Admin Forgot Password API**
7. **Admin Reset Password API**
8. **Customer Profile Retrieval and Update APIs**
9. **Customer Password Change API**
10. **Authentication and Admin Access Protection Integration**
11. **Sign Up, Login, Password Recovery and Profile Frontend Integration**

---

## 1. User Database Model

The `User` database model represents patrons, administrators, and restaurant team members. It is configured in both SQLite (`prisma/schema.prisma` for rapid local development) and MySQL (`prisma/schema.mysql.prisma` for production).

### Prisma Model Definition

```prisma
model User {
  id        Int      @id @default(autoincrement())
  name      String
  email     String   @unique
  password  String
  role      Role     @default(CUSTOMER) // Enum in MySQL, String in SQLite
  phone     String?
  city      String?
  address   String?
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt

  orders    Order[]

  @@map("users")
}
```

### MySQL SQL Schema (Generated via Migration)

```sql
CREATE TABLE `users` (
    `id` INTEGER NOT NULL AUTO_INCREMENT,
    `name` VARCHAR(191) NOT NULL,
    `email` VARCHAR(191) NOT NULL,
    `password` VARCHAR(191) NOT NULL,
    `role` ENUM('CUSTOMER', 'ADMIN', 'CHEF') NOT NULL DEFAULT 'CUSTOMER',
    `createdAt` DATETIME(3) NOT NULL DEFAULT CURRENT_TIMESTAMP(3),
    `updatedAt` DATETIME(3) NOT NULL,

    UNIQUE INDEX `users_email_key`(`email`),
    PRIMARY KEY (`id`)
) DEFAULT CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
```

---

## 2. Password Hashing & Security Utilities

All cryptographic password management is implemented in `src/lib/auth.js`:

- **Bcrypt Salt Rounds**: `12` rounds for high resistance against brute-force attacks.
- **Salt Uniqueness**: Generates a distinct salt per password.
- **Constant-time Comparison**: `bcrypt.compare` eliminates timing analysis risks.
- **Response Sanitization**: `sanitizeUser()` strips the `password` field from all output payloads.
- **Token Management**:
  - `generateToken(payload)`: Signs JWT authentication tokens (`JWT_EXPIRES_IN || '7d'`).
  - `generatePasswordResetToken(user)`: Signs 15-minute time-limited password recovery tokens (`type: 'pwd_reset'`).

---

## 3. Customer Sign Up API

- **Endpoints**: `POST /api/auth/register` & `POST /api/auth/signup`
- **Access**: Public
- **Role Enforcement**: Strictly assigns `role: 'CUSTOMER'`.

### Request Body
```json
{
  "name": "Thrishala Weerasekara",
  "email": "thrishala@example.lk",
  "password": "PatronPassword123"
}
```

### Responses
- `201 Created`:
  ```json
  {
    "success": true,
    "message": "Account registered successfully",
    "data": {
      "user": { "id": 1, "name": "Thrishala Weerasekara", "email": "thrishala@example.lk", "role": "CUSTOMER" },
      "token": "eyJhbGciOi..."
    }
  }
  ```
- `400 Bad Request`: Missing field, invalid email format, or short password.
- `409 Conflict`: Email already exists (`"Email already registered"`).

---

## 4. Customer and Admin Login API

Thrishala's architecture supports unified authentication and dedicated role-restricted login portals:

| Method | Endpoint | Purpose | Access Rule |
|---|---|---|---|
| `POST` | `/api/auth/login` | Unified login (Customer & Admin) | Any valid registered user |
| `POST` | `/api/auth/customer/login` | Dedicated customer portal | User with `role: 'CUSTOMER'` |
| `POST` | `/api/auth/admin/login` | Dedicated admin dashboard portal | User with `role: 'ADMIN'` (returns `403` for customers) |

---

## 5. Admin Forgot & Reset Password APIs

Allows restaurant administrators and patrons to securely recover access using time-delimited reset tokens.

### 5.1 Admin Forgot Password (`POST /api/auth/admin/forgot-password`)
- Request: `{ "email": "admin@fuchsius.com" }`
- Validates user existence and verifies `user.role === 'ADMIN'`.
- Returns a signed 15-minute reset token:
  ```json
  {
    "success": true,
    "message": "Authenticated access link dispatched to admin@fuchsius.com",
    "data": {
      "email": "admin@fuchsius.com",
      "resetToken": "eyJhbGciOi...",
      "expiresIn": "15 minutes"
    }
  }
  ```

### 5.2 Admin Reset Password (`POST /api/auth/admin/reset-password`)
- Request:
  ```json
  {
    "token": "eyJhbGciOi...",
    "newPassword": "NewStrongAdminPassword123"
  }
  ```
- Validates the 15-minute token signature and `role === 'ADMIN'`.
- Hashes `newPassword` with bcrypt and updates user in MySQL.
- Returns `{ "success": true, "message": "Admin password reset successfully." }`.

*(Unified endpoints `POST /api/auth/forgot-password` and `POST /api/auth/reset-password` are also available for patrons).*

---

## 6. Customer Profile Retrieval & Update APIs

Patrons can view and update their profile dossier:

- **Get Profile**: `GET /api/auth/profile` and `GET /api/auth/me`
  - Requires `protect` middleware.
  - Returns current patron profile data (id, name, email, role, dates).
- **Update Profile**: `PUT /api/auth/profile` and `PATCH /api/auth/profile`
  - Requires `protect` middleware.
  - Body: `{ "name": "Thrishala W.", "phone": "077 123 4567", "city": "Colombo", "address": "45 Temple Road" }`
  - Updates profile name in database and returns synchronized patron details.

---

## 7. Customer Password Change API

Allows logged-in patrons to rotate their authentication credentials:

- **Endpoint**: `POST /api/auth/change-password` and `PUT /api/auth/change-password`
- **Requires**: `protect` middleware
- **Body**:
  ```json
  {
    "currentPassword": "OldPassword123",
    "newPassword": "NewStrongPassword456"
  }
  ```
- **Validation**: Verifies `currentPassword` against bcrypt hash in database. Hashes `newPassword` and saves update. Returns `401` if current password is incorrect.

---

## 8. Authentication & Admin Access Protection Integration

- **Backend Route Guarding**:
  - `admin.routes.js`: `GET /api/admin/dashboard` is guarded with `protect, adminOnly` so unauthorized clients cannot access restaurant metrics.
  - `menu.routes.js`, `category.routes.js`, `order.routes.js`: Guarded by `protect, adminOnly` (from Thrishala's `auth.middleware.js`).
- **Frontend Route Protection**:
  - `ProtectedRoute.jsx`: Automatically redirects unauthorized or non-admin visitors to `/admin-login`.
  - `CustomerProfilePage.jsx`: Automatically checks authentication state and synchronizes profile data.

---

## 9. Frontend Integration Overview

The frontend authentication experience has been integrated with the backend APIs:

| Page / Component | Connected API | Purpose |
|---|---|---|
| `LoginPage.jsx` / `SignInCustomerCard.jsx` | `POST /api/auth/login` | Patron sign in |
| `LoginPage.jsx` / `SignInAdminCard.jsx` | `POST /api/auth/admin/login` | Admin portal sign in |
| `RegisterPage.jsx` / `RegisterCard.jsx` | `POST /api/auth/register` | Customer sign up |
| `ForgotPasswordPage.jsx` / `ForgotPasswordCard.jsx` | `POST /api/auth/forgot-password` | Dispatches 15-minute token |
| `ResetPasswordPage.jsx` / `ResetPasswordCard.jsx` | `POST /api/auth/reset-password` | Resets password with token |
| `CustomerProfilePage.jsx` / `MyProfileTab.jsx` | `GET /api/auth/me`, `PUT /api/auth/profile` | Loads & saves patron dossier |
| `SecurityTab.jsx` | `POST /api/auth/change-password` | Rotates patron passkey |
| `api.js` | `authApi` | Exported client service for all auth endpoints |

---

## 10. Verification & Test Execution

Run the complete test suite:

```bash
npm test
```

Test coverage includes:
- [auth.test.js](file:///c:/Users/DELL/Downloads/Resturanta-web-Team-A6-main/Resturanta-web-Team-A6-main/backend/tests/auth.test.js): Password hashing, bcrypt comparison, email format verification, password constraints, token generation & decoding, and all auth middleware (`protect`, `adminOnly`, `customerOnly`, `requireRole`, `optionalAuth`).
- [auth.integration.test.js](file:///c:/Users/DELL/Downloads/Resturanta-web-Team-A6-main/Resturanta-web-Team-A6-main/backend/tests/auth.integration.test.js): End-to-end HTTP integration testing for register, customer login, admin login, admin forgot password, admin reset password, admin dashboard protection, profile retrieval/updates, and password changes.
