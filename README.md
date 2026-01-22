# Customer Feedback Management Platform

A comprehensive backend application built with the MERN stack to help businesses efficiently collect, manage, and analyze customer feedback.

## Overview

This platform provides a robust solution for managing customer feedback through RESTful APIs. It enables organizations to track customer requests, monitor feedback status, analyze trends, and improve their products or services based on real user insights.

## Features

- 🔐 **Authentication & Authorization**: Secure JWT-based authentication with role-based access control
- 👥 **User Management**: Admin capabilities for managing platform users
- 📋 **Customer Database**: Comprehensive customer information management
- 💬 **Feedback Management**: Create, update, and track feedback with status workflows
- 🗨️ **Comments System**: Threaded discussions on feedback items (in progress)
- 📊 **Dashboard Analytics**: Real-time statistics and insights
- 📈 **Status History**: Track feedback lifecycle and changes over time

## Tech Stack

- **Node.js**: Runtime environment
- **Express.js** (v5.1.0): Web application framework
- **MongoDB**: NoSQL database for data storage
- **Mongoose** (v9.0.0): Elegant MongoDB object modeling
- **JWT**: Token-based authentication
- **bcrypt** (v6.0.0): Password hashing and security
- **CORS**: Cross-origin resource sharing
- **Cookie Parser**: Cookie handling middleware

## Prerequisites

Before running this application, ensure you have:

- Node.js (v16 or higher recommended)
- npm or yarn package manager
- MongoDB (local installation or MongoDB Atlas account)

## Installation

1. **Clone the repository:**
```bash
git clone https://github.com/prachirajpurohit/customer-feedback-management-platform.git
cd customer-feedback-management-platform
```

2. **Install dependencies:**
```bash
npm install
```

3. **Create a `.env` file in the root directory:**
```env
PORT=3000
MONGODB_URI=your_mongodb_connection_string
CORS_ORIGIN=http://localhost:3000

# JWT Configuration
JWT_ACCESS_SECRET=your_jwt_secret_key_here
JWT_ACCESS_EXPIRY=1d
JWT_REFRESH_SECRET=your_refresh_token_secret
JWT_REFRESH_EXPIRY=10d

# Environment
NODE_ENV=development
```

4. **Start the server:**
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

The server will start on `http://localhost:3000` (or your configured PORT).

## API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### Authentication Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/auth/register` | Register a new user |
| POST | `/auth/login` | User login |
| POST | `/auth/logout` | User logout |
| POST | `/auth/refresh-token` | Refresh access token |
| POST | `/auth/change-password` | Change user password |

### User Management

| Method | Endpoint | Description | Admin Only |
|--------|----------|-------------|-------------|
| GET | `/users` | Get all users | Yes |
| GET | `/users/:id` | Get user by ID | Yes |
| GET | `/users/me` | Get current user profile | No |
| PATCH | `/users/:id` | Update user | Yes |
| DELETE | `/users/:id` | Soft delete user | Yes |

### Customer Management

| Method | Endpoint | Description | -- |
|--------|----------|-------------| -- |
| GET | `/customers` | Get all customers | -- |
| POST | `/customers` | Create new customer | -- |
| GET | `/customers/:id` | Get customer by ID | -- |
| GET | `/customers/search?q={query}` | Search customers | -- |
| PATCH | `/customers/:id` | Update customer | -- |
| DELETE | `/customers/:id` | Delete customer | Admin Only | 

### Feedback Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/feedback` | Get all feedback |
| POST | `/feedback` | Create new feedback |
| GET | `/feedback/:id` | Get feedback by ID |
| PATCH | `/feedback/:id` | Update feedback |
| PATCH | `/feedback/:id/status` | Update feedback status |
| DELETE | `/feedback/:id` | Soft delete feedback |
| GET | `/feedback/:id/history` | Get status history |

### Comments (WIP)

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/feedback/:feedbackId/comments` | Get all comments for feedback |
| POST | `/feedback/:feedbackId/comments` | Add comment to feedback |
| PATCH | `/comments/:id` | Update comment |
| DELETE | `/comments/:id` | Delete comment |

## Project Structure

```
customer-feedback-management-platform/
├── src/
│   ├── controllers/         # Route controllers
│   │   ├── auth.controller.js
│   │   ├── user.controller.js
│   │   ├── customer.controller.js
│   │   ├── feedback.controller.js
│   │   └── (comments - in progress)
│   ├── models/              # Mongoose models
│   │   ├── user.model.js
│   │   ├── customer.model.js
│   │   ├── feedback.model.js
│   │   └── comment.model.js
│   ├── routes/              # API routes
│   │   ├── auth.route.js
│   │   ├── user.route.js
│   │   ├── customer.route.js
│   │   ├── feedback.route.js
│   │   └── healthcheck.route.js
│   ├── middleware/          # Custom middleware
│   │   ├── auth.middleware.js
│   │   └── user.middleware.js
│   ├── utils/               # Utility functions
│   ├── app.js               # Express app setup
│   └── index.js             # Entry point
├── public/                  # Static files
├── .env                     # Environment variables
├── package.json
└── README.md
```

## Feedback Status Workflow

```
new → under_review → planned → in_progress → completed
                            ↘ wont_do
```

**Status Options:**
- `new`: Newly submitted feedback
- `under_review`: Being evaluated by the team
- `planned`: Accepted and scheduled for future development
- `in_progress`: Currently being worked on
- `completed`: Implementation finished
- `wont_do`: Decided not to implement

## Feedback Categories

- `bug`: Software defects or issues
- `feature_request`: New feature suggestions
- `improvement`: Enhancements to existing features
- `question`: General inquiries

## Customer Segments

- `enterprise`: Large enterprise clients
- `mid_market`: Mid-sized businesses
- `small_business`: Small businesses
- `startup`: Startup companies

## Environment Variables

| Variable | Description | Required | Default |
|----------|-------------|----------|---------|
| `PORT` | Server port number | Yes | 3000 |
| `MONGO_URI` | MongoDB connection string | Yes | - |
| `CORS_ORIGIN` | Allowed CORS origin | Yes | - |
| `JWT_ACCESS_SECRET` | Secret key for JWT tokens | Yes | - |
| `JWT_ACCESS_EXPIRY` | JWT token expiration time | No | 7d |
| `JWT_REFRESH_SECRET` | Secret for refresh tokens | Yes | - |
| `JWT_REFRESH_EXPIRY` | Refresh token expiration | No | 30d |
| `NODE_ENV` | Environment mode | No | development |

## Health Check

Check if the API is running:
```bash
GET /healthcheck
```

## Development

1. **Run in development mode with auto-reload:**
```bash
npm run dev
```

2. **Code formatting with Prettier:**
```bash
npx prettier --write .
```

## Roadmap

- [x] Authentication system
- [x] User management
- [x] Customer management
- [x] Feedback CRUD operations
- [x] Advanced filtering and search
- [x] Dashboard analytics
- [x] Status history tracking
- [ ] Comments system
- [ ] Email notifications
- [ ] File attachments
- [ ] Forgot password functionality
- [ ] Real-time updates with WebSockets
- [ ] Export reports (CSV/PDF)
- [ ] ...
