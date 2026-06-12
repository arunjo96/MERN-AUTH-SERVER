# MERN Authentication System 🔐

A secure authentication and user management REST API built with Node.js, Express.js, MongoDB Atlas, JWT Authentication, and Nodemailer.


## Features

- User Registration
- User Login
- JWT Authentication
- Protected Routes
- Forgot Password
- Reset Password via Email
- Profile Management
- Password Hashing using bcryptjs
- MongoDB Atlas Integration

---

## Tech Stack

### Backend
- Node.js
- Express.js
- MongoDB Atlas
- Mongoose

### Authentication & Security
- JWT (jsonwebtoken)
- bcryptjs
- crypto

### Email Service
- Nodemailer

---

## Project Structure

```bash
src/
│
├── controllers/
│   └── authController.js
│
├── middleware/
│   ├── authMiddleware.js
│   └── errorHandler.js
│
├── models/
│   └── User.js
│
├── routes/
│   └── authRoutes.js
│
├── utils/
│   ├── generateToken.js
│   ├── sendMail.js
│   └── templates/
│       └── resetPasswordTemplate.js
│
├── config/
│   └── db.js
│
└── server.js
```

---

## Installation

### Clone Repository

```bash
git clone https://github.com/arunjo96/mern_auth.git

```

### Install Dependencies

```bash
npm install
```

---

## Run Project

```bash
npm run dev
```
---

## Security Features

- Password Hashing using bcryptjs
- JWT Authentication
- Protected Routes
- Password Field Hidden from Queries
- Reset Password Token Expiry (15 Minutes)

---

## Email Service Notice

### Nodemailer Limitation

The Forgot Password feature works successfully in the local development environment.

However, email delivery may not work in deployed/live environments.

---


