# MVP Technical Specification
## Customer Feedback Platform - Backend

**Document Version:** 1.0  
**Date:** November 27, 2025  
**Target Timeline:** 6 weeks  
**Related Doc:** MVP PRD v1.0

---

## 1. Technology Stack

### Core Technologies
- **Runtime:** Node.js (v20 LTS)
- **Framework:** Express.js
- **Database:** PostgreSQL (v15+)
- **ORM:** Prisma
- **Authentication:** JWT (jsonwebtoken)
- **Password Hashing:** bcrypt
- **Validation:** express-validator or Zod
- **Environment:** dotenv

### Development Tools
- **Language:** TypeScript (recommended) or JavaScript
- **Testing:** Jest (optional for MVP, but recommended)
- **API Documentation:** Basic README (Swagger/OpenAPI Phase 2)
- **Code Quality:** ESLint + Prettier

### Deployment (Recommendation)
- **Hosting:** Render, Railway, or AWS EC2
- **Database:** Render PostgreSQL, Railway, or AWS RDS
- **Environment:** Production + Staging

---

## 2. Database Schema (Simplified)

### 2.1 Users Table
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(200) NOT NULL,
  role VARCHAR(20) NOT NULL CHECK (role IN ('admin', 'user')),
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_is_active ON users(is_active);
```

### 2.2 Customers Table
```sql
CREATE TABLE customers (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(200) NOT NULL,
  company VARCHAR(200) NOT NULL,
  email VARCHAR(255),
  segment VARCHAR(50) CHECK (segment IN ('enterprise', 'mid_market', 'smb', 'startup')),
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_customers_company ON customers(company);
```

### 2.3 Feedback Table
```sql
CREATE TABLE feedback (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  description TEXT NOT NULL,
  category VARCHAR(50) NOT NULL CHECK (category IN ('bug', 'feature_request', 'improvement', 'question')),
  status VARCHAR(50) NOT NULL DEFAULT 'new' CHECK (status IN ('new', 'under_review', 'planned', 'in_progress', 'completed', 'wont_do')),
  customer_id UUID REFERENCES customers(id) ON DELETE SET NULL,
  created_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  is_deleted BOOLEAN DEFAULT false
);

CREATE INDEX idx_feedback_status ON feedback(status);
CREATE INDEX idx_feedback_category ON feedback(category);
CREATE INDEX idx_feedback_customer_id ON feedback(customer_id);
CREATE INDEX idx_feedback_created_at ON feedback(created_at);
CREATE INDEX idx_feedback_is_deleted ON feedback(is_deleted);
CREATE INDEX idx_feedback_fulltext ON feedback USING gin(to_tsvector('english', title || ' ' || description));
```

### 2.4 Comments Table
```sql
CREATE TABLE comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id UUID NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
  author_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  comment_text TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_comments_feedback_id ON comments(feedback_id);
CREATE INDEX idx_comments_created_at ON comments(created_at);
```

### 2.5 Status History Table
```sql
CREATE TABLE status_history (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  feedback_id UUID NOT NULL REFERENCES feedback(id) ON DELETE CASCADE,
  old_status VARCHAR(50),
  new_status VARCHAR(50) NOT NULL,
  changed_by_user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  reason TEXT,
  changed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX idx_status_history_feedback_id ON status_history(feedback_id);
CREATE INDEX idx_status_history_changed_at ON status_history(changed_at);
```

---

## 3. Prisma Schema

```prisma
// schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model User {
  id            String   @id @default(uuid())
  email         String   @unique
  passwordHash  String   @map("password_hash")
  fullName      String   @map("full_name")
  role          Role
  isActive      Boolean  @default(true) @map("is_active")
  createdAt     DateTime @default(now()) @map("created_at")
  updatedAt     DateTime @updatedAt @map("updated_at")

  feedbackCreated Feedback[]      @relation("FeedbackCreator")
  comments        Comment[]
  statusChanges   StatusHistory[]

  @@index([email])
  @@index([isActive])
  @@map("users")
}

enum Role {
  admin
  user
}

model Customer {
  id        String   @id @default(uuid())
  name      String
  company   String
  email     String?
  segment   Segment?
  createdAt DateTime @default(now()) @map("created_at")
  updatedAt DateTime @updatedAt @map("updated_at")

  feedback Feedback[]

  @@index([company])
  @@map("customers")
}

enum Segment {
  enterprise
  mid_market
  smb
  startup
}

model Feedback {
  id              String   @id @default(uuid())
  title           String
  description     String
  category        Category
  status          Status   @default(new)
  customerId      String?  @map("customer_id")
  createdByUserId String   @map("created_by_user_id")
  createdAt       DateTime @default(now()) @map("created_at")
  updatedAt       DateTime @updatedAt @map("updated_at")
  isDeleted       Boolean  @default(false) @map("is_deleted")

  customer      Customer?       @relation(fields: [customerId], references: [id], onDelete: SetNull)
  createdBy     User            @relation("FeedbackCreator", fields: [createdByUserId], references: [id], onDelete: Cascade)
  comments      Comment[]
  statusHistory StatusHistory[]

  @@index([status])
  @@index([category])
  @@index([customerId])
  @@index([createdAt])
  @@index([isDeleted])
  @@map("feedback")
}

enum Category {
  bug
  feature_request
  improvement
  question
}

enum Status {
  new
  under_review
  planned
  in_progress
  completed
  wont_do
}

model Comment {
  id             String   @id @default(uuid())
  feedbackId     String   @map("feedback_id")
  authorUserId   String   @map("author_user_id")
  commentText    String   @map("comment_text")
  createdAt      DateTime @default(now()) @map("created_at")
  updatedAt      DateTime @updatedAt @map("updated_at")

  feedback Feedback @relation(fields: [feedbackId], references: [id], onDelete: Cascade)
  author   User     @relation(fields: [authorUserId], references: [id], onDelete: Cascade)

  @@index([feedbackId])
  @@index([createdAt])
  @@map("comments")
}

model StatusHistory {
  id              String   @id @default(uuid())
  feedbackId      String   @map("feedback_id")
  oldStatus       String?  @map("old_status")
  newStatus       String   @map("new_status")
  changedByUserId String   @map("changed_by_user_id")
  reason          String?
  changedAt       DateTime @default(now()) @map("changed_at")

  feedback  Feedback @relation(fields: [feedbackId], references: [id], onDelete: Cascade)
  changedBy User     @relation(fields: [changedByUserId], references: [id], onDelete: Cascade)

  @@index([feedbackId])
  @@index([changedAt])
  @@map("status_history")
}
```

---

## 4. API Endpoints (MVP)

### 4.1 Authentication

```
POST   /api/auth/register
POST   /api/auth/login
POST   /api/auth/logout
POST   /api/auth/refresh-token
POST   /api/auth/change-password
```
~~POST   /api/auth/forgot-password~~
~~POST   /api/auth/reset-password~~

**Example: Login**
```javascript
POST /api/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "securepassword"
}

Response 200:
{
  "token": "eyJhbGciOiJIUzI1NiIs...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "fullName": "John Doe",
    "role": "user"
  }
}
```

### 4.2 Users (Admin Only)

```
GET    /api/users
GET    /api/users/:id
PATCH  /api/users/:id
DELETE /api/users/:id (soft delete - set is_active = false)
GET    /api/users/me (current user profile)
```

### 4.3 Customers

```
GET    /api/customers
POST   /api/customers
GET    /api/customers/:id
PATCH  /api/customers/:id
DELETE /api/customers/:id
GET    /api/customers/search?q={query}
```

### 4.4 Feedback

```
GET    /api/feedback
POST   /api/feedback
GET    /api/feedback/:id
PATCH  /api/feedback/:id
DELETE /api/feedback/:id (admin only, soft delete)
PATCH  /api/feedback/:id/status
```

**Query Parameters for GET /api/feedback:**
- `status` (array): Filter by status
- `category` (array): Filter by category
- `customer` (string): Filter by customer company (partial match)
- `search` (string): Full-text search
- `dateFrom` (ISO date): Created after this date
- `dateTo` (ISO date): Created before this date
- `sortBy` (string): created_at, updated_at, title
- `sortOrder` (string): asc, desc
- `page` (number): Page number (default: 1)
- `limit` (number): Items per page (default: 20, max: 100)

**Example: Create Feedback**
```javascript
POST /api/feedback
Authorization: Bearer {token}
Content-Type: application/json

{
  "title": "Add dark mode support",
  "description": "Many users are requesting a dark mode option for the dashboard",
  "category": "feature_request",
  "customer": {
    "name": "Jane Smith",
    "company": "Acme Corp",
    "email": "jane@acme.com",
    "segment": "enterprise"
  }
}

Response 201:
{
  "id": "uuid",
  "title": "Add dark mode support",
  "description": "Many users are requesting...",
  "category": "feature_request",
  "status": "new",
  "customer": {
    "id": "uuid",
    "name": "Jane Smith",
    "company": "Acme Corp"
  },
  "createdBy": {
    "id": "uuid",
    "fullName": "John Doe"
  },
  "createdAt": "2025-11-27T10:30:00Z",
  "updatedAt": "2025-11-27T10:30:00Z"
}
```

**Example: Update Status**
```javascript
PATCH /api/feedback/:id/status
Authorization: Bearer {token}
Content-Type: application/json

{
  "status": "planned",
  "reason": "Added to Q1 2026 roadmap"
}

Response 200:
{
  "id": "uuid",
  "status": "planned",
  "updatedAt": "2025-11-27T11:00:00Z"
}
```

### 4.5 Comments

```
GET    /api/feedback/:feedbackId/comments
POST   /api/feedback/:feedbackId/comments
PATCH  /api/comments/:id
DELETE /api/comments/:id
```

**Example: Add Comment**
```javascript
POST /api/feedback/:feedbackId/comments
Authorization: Bearer {token}
Content-Type: application/json

{
  "commentText": "Discussed with the team, this is feasible for Q1"
}

Response 201:
{
  "id": "uuid",
  "commentText": "Discussed with the team...",
  "author": {
    "id": "uuid",
    "fullName": "John Doe"
  },
  "createdAt": "2025-11-27T11:15:00Z"
}
```

### 4.6 Dashboard

```
GET    /api/dashboard/stats
GET    /api/dashboard/recent-activity
```

**Example: Dashboard Stats**
```javascript
GET /api/dashboard/stats
Authorization: Bearer {token}

Response 200:
{
  "totalFeedback": 247,
  "byStatus": {
    "new": 45,
    "under_review": 32,
    "planned": 28,
    "in_progress": 15,
    "completed": 120,
    "wont_do": 7
  },
  "byCategory": {
    "bug": 58,
    "feature_request": 142,
    "improvement": 35,
    "question": 12
  },
  "topCustomers": [
    { "company": "Acme Corp", "count": 23 },
    { "company": "TechStart Inc", "count": 18 },
    { "company": "Global Systems", "count": 15 },
    { "company": "DataFlow", "count": 12 },
    { "company": "CloudNine", "count": 10 }
  ]
}
```

### 4.7 Status History

```
GET    /api/feedback/:feedbackId/history
```

---

## 5. Authentication & Authorization

### 5.1 JWT Implementation

**Token Structure:**
```javascript
{
  userId: "uuid",
  email: "user@example.com",
  role: "user",
  iat: 1700000000,
  exp: 1700086400  // 24 hours from iat
}
```

**Environment Variables:**
```
JWT_SECRET=your-super-secret-key-min-32-chars
JWT_EXPIRATION=24h
```

### 5.2 Middleware

**Authentication Middleware:**
```javascript
// Verify JWT token exists and is valid
// Attach user object to req.user
// Return 401 if invalid
```

**Authorization Middleware:**
```javascript
// Check if req.user.role has permission for action
// Admin can do everything
// User can do everything except: delete feedback, manage users
```

### 5.3 Password Requirements

- Minimum 8 characters
- Hash using bcrypt with salt rounds = 10
- Store only hash, never plain text

---

## 6. Business Logic

### 6.1 Feedback Creation

1. Validate all required fields
2. Check if customer exists by company name + email
   - If exists: link to existing customer
   - If not: create new customer
3. Create feedback with status = "new"
4. Create initial status history entry
5. Return feedback with customer and creator info

### 6.2 Status Change

1. Validate new status is valid enum value
2. If changing to "wont_do", require reason
3. Get current status
4. Update feedback status
5. Create status history entry
6. Return updated feedback

### 6.3 Search Implementation

**Full-text search:**
```sql
SELECT * FROM feedback
WHERE 
  is_deleted = false
  AND to_tsvector('english', title || ' ' || description) 
      @@ plainto_tsquery('english', $1)
ORDER BY 
  ts_rank(to_tsvector('english', title || ' ' || description), 
          plainto_tsquery('english', $1)) DESC;
```

**Filter combination:**
- All filters use AND logic
- Array filters use IN clause
- Text search on customer uses ILIKE '%query%'
- Date filters use >= and <=

### 6.4 Soft Delete

- Never actually DELETE rows
- Set `is_deleted = true`
- All queries must filter `WHERE is_deleted = false`
- Admin can view deleted items with special flag

---

## 7. Error Handling

### 7.1 HTTP Status Codes

- **200**: Success
- **201**: Created
- **400**: Bad Request (validation errors)
- **401**: Unauthorized (not authenticated)
- **403**: Forbidden (authenticated but not authorized)
- **404**: Not Found
- **409**: Conflict (e.g., email already exists)
- **500**: Internal Server Error

### 7.2 Error Response Format

```javascript
{
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### 7.3 Validation Rules

**Feedback:**
- title: 1-200 characters, required
- description: 1-10000 characters, required
- category: must be valid enum
- status: must be valid enum (if provided)

**Customer:**
- name: 1-200 characters, required
- company: 1-200 characters, required
- email: valid email format (if provided)
- segment: must be valid enum (if provided)

**User:**
- email: valid email format, unique, required
- password: min 8 characters, required
- fullName: 1-200 characters, required
- role: must be valid enum

**Comment:**
- commentText: 1-5000 characters, required

---

## 8. Environment Configuration

### 8.1 Required Environment Variables

```bash
# Database
DATABASE_URL=postgresql://user:password@localhost:5432/feedback_db

# JWT
JWT_SECRET=your-super-secret-key-minimum-32-characters-long
JWT_EXPIRATION=24h

# Server
PORT=3000
NODE_ENV=development

# Email (for password reset - Phase 2, use console.log for MVP)
# SMTP_HOST=smtp.gmail.com
# SMTP_PORT=587
# SMTP_USER=your-email@gmail.com
# SMTP_PASS=your-app-password

# CORS
CORS_ORIGIN=http://localhost:3001
```

---

## 9. Testing Strategy

### 9.1 Manual Testing Checklist

**Authentication:**
- [ ] Register new user
- [ ] Login with correct credentials
- [ ] Login with wrong credentials (should fail)
- [ ] Access protected route without token (should fail)
- [ ] Access protected route with valid token (should work)

**Feedback CRUD:**
- [ ] Create feedback with new customer
- [ ] Create feedback with existing customer
- [ ] List feedback with no filters
- [ ] List feedback with status filter
- [ ] Search feedback by keyword
- [ ] Update feedback details
- [ ] Change feedback status
- [ ] Delete feedback (admin only)

**Comments:**
- [ ] Add comment to feedback
- [ ] List all comments for feedback
- [ ] Edit own comment
- [ ] Cannot edit others' comments

**Dashboard:**
- [ ] View stats
- [ ] Stats reflect actual database counts

### 9.2 Unit Testing (Optional for MVP)

If implementing tests:
- Test authentication middleware
- Test validation logic
- Test status change logic
- Test search functionality

---

## 10. Deployment Guide

### 10.1 Database Setup

```bash
# Install PostgreSQL (if not already)
# Create database
createdb feedback_db

# Run Prisma migrations
npx prisma migrate dev --name init

# Seed initial admin user (create seed script)
npx prisma db seed
```

### 10.2 Seed Script

```javascript
// prisma/seed.js
const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

async function main() {
  const passwordHash = await bcrypt.hash('admin123', 10);
  
  await prisma.user.create({
    data: {
      email: 'admin@company.com',
      passwordHash,
      fullName: 'Admin User',
      role: 'admin',
    },
  });
  
  console.log('Seed completed: Admin user created');
}

main()
  .catch((e) => console.error(e))
  .finally(async () => await prisma.$disconnect());
```

### 10.3 Production Deployment

**Steps:**
1. Set up PostgreSQL database (Render, Railway, AWS RDS)
2. Set environment variables in hosting platform
3. Deploy application
4. Run database migrations: `npx prisma migrate deploy`
5. Seed admin user
6. Test basic functionality
7. Monitor logs

**Recommended Platforms:**
- **Render:** Easy, free tier available, auto-deploy from Git
- **Railway:** Simple, good free tier, built-in PostgreSQL
- **AWS EC2 + RDS:** More control, scalable, requires more setup

---

## 11. Performance Considerations

### 11.1 Database Optimization

- Use indexes (already defined in schema)
- Limit query results (pagination)
- Avoid N+1 queries (use Prisma's `include` carefully)
- Use connection pooling (Prisma handles this)

### 11.2 API Optimization

- Implement basic caching for dashboard stats (Phase 2)
- Paginate all list endpoints (max 100 per page)
- Add request timeout (30 seconds)
- Log slow queries (>1 second)

---

## 12. Security Checklist

- [ ] All passwords hashed with bcrypt
- [ ] JWT secret is strong and environment-specific
- [ ] HTTPS enforced in production
- [ ] CORS configured properly
- [ ] Input validation on all endpoints
- [ ] SQL injection prevention (Prisma handles this)
- [ ] Rate limiting on auth endpoints (Phase 2)
- [ ] Sensitive data not logged
- [ ] Environment variables never committed to Git

---

## 13. Documentation Requirements

Developer must provide:

1. **README.md** with:
   - Setup instructions
   - Environment variables list
   - How to run locally
   - How to run migrations
   - Basic API usage examples

2. **API Endpoints List** (simple markdown table)

3. **Database Diagram** (can be simple, even hand-drawn)

