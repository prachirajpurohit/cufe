# MVP Product Requirements Document
## Customer Feedback Platform - Version 1.0 (MVP)

**Document Version:** 1.0  
**Date:** November 27, 2025  
**Status:** Ready for Development  
**Target Timeline:** 6 weeks  
**Team Size:** 1 Backend Developer

---

## 1. Executive Summary

We're building a **minimal viable product** to centralize customer feedback collection and tracking. This MVP focuses on core functionality: capturing feedback, organizing it, tracking status, and providing basic visibility through a simple dashboard.

**What we're building:** A REST API backend that lets our team submit, view, search, and manage customer feedback.

**What we're NOT building yet:** Integrations, complex analytics, file uploads, notifications, themes, advanced permissions.

---

## 2. MVP Goals

### Primary Objectives
1. Replace our current spreadsheet-based feedback tracking
2. Give the team a single place to log and view all feedback
3. Track feedback through simple status workflow
4. Provide basic search and filtering
5. Show simple metrics on a dashboard

### Success Criteria
- ✅ Team can submit feedback in under 2 minutes
- ✅ Team can find existing feedback via search
- ✅ Product managers can see what's most requested
- ✅ Status updates are tracked and visible
- ✅ 10+ team members actively using within first month

---

## 3. Core Features (MVP Only)

### 3.1 User Authentication
- Email and password login
- Simple user registration (admin can create accounts)
- JWT-based sessions
- Password reset via email

**Out of scope:** SSO, MFA, OAuth

### 3.2 Feedback Management

**Submit Feedback:**
- Title (required)
- Description (required, rich text)
- Category (dropdown: Bug, Feature Request, Improvement, Question)
- Customer name (text input)
- Customer company (text input)
- Status (auto-set to "New")

**View Feedback:**
- List view with pagination (20 per page)
- Click to view full details
- See all comments/notes
- View status history

**Edit Feedback:**
- Update any field
- Change status
- Add internal notes

**Delete Feedback:**
- Soft delete (mark as deleted, don't remove from DB)
- Admin only

**Out of scope:** File attachments, merging duplicates, linking to external tools, themes, tags

### 3.3 Customer Information

**Basic customer tracking:**
- Name
- Company
- Email (optional)
- Segment (dropdown: Enterprise, Mid-Market, SMB, Startup)

**Link to feedback:**
- One piece of feedback can be associated with one customer
- Can search feedback by customer

**Out of scope:** CRM integration, revenue tracking, customer profiles

### 3.4 Status Workflow

**Simple statuses:**
- New
- Under Review
- Planned
- In Progress
- Completed
- Won't Do

**Rules:**
- Status can be changed by any user
- Status changes are logged with timestamp and user
- When marking "Won't Do", reason is required

**Out of scope:** Complex workflow rules, automated status changes, approvals

### 3.5 Comments/Notes

- Add internal notes to any feedback
- View all notes chronologically
- Edit your own notes within 24 hours
- See who wrote each note and when

**Out of scope:** External customer-facing comments, @mentions, notifications

### 3.6 Search & Filters

**Search:**
- Full-text search across title and description
- Search results show relevance ranking

**Filters:**
- Status (multi-select)
- Category (multi-select)
- Customer company (text search)
- Date range (created date)

**Sorting:**
- Created date (newest/oldest)
- Updated date (most/least recent)
- Title (A-Z)

**Out of scope:** Saved filters, advanced queries, export

### 3.7 Dashboard

**Simple metrics:**
- Total feedback count
- Breakdown by status (pie chart or bars)
- Breakdown by category
- Recent activity (last 10 items updated)
- Most mentioned customers (top 5)

**Out of scope:** Trends over time, priority scoring, custom reports, executive dashboards

### 3.8 User Management

**Two roles only:**
- **Admin:** Full access, can manage users
- **User:** Can do everything except delete feedback or manage users

**User management (admin only):**
- Create new users
- Deactivate users
- Reset passwords
- View user list

**Out of scope:** Granular permissions, teams, role customization

---

## 4. User Flows

### Flow 1: Submit New Feedback
1. User clicks "New Feedback"
2. Fills out form (title, description, category, customer info)
3. Clicks "Submit"
4. System creates feedback with status "New"
5. User sees confirmation and can view the feedback

### Flow 2: Review & Update Feedback
1. User views feedback list
2. Applies filters or searches
3. Clicks on feedback item
4. Reads details and comments
5. Updates status or adds a note
6. Changes are saved and logged

### Flow 3: Track Status
1. Product manager views dashboard
2. Sees breakdown of feedback by status
3. Clicks on "Planned" status
4. Views filtered list of planned items
5. Updates one to "In Progress"

---

## 5. Technical Requirements

### 5.1 Performance
- API response time: < 500ms for most requests
- Search results: < 2 seconds
- Support 20 concurrent users
- Handle 5,000 feedback items minimum

### 5.2 Data Requirements
- Store up to 10,000 feedback items
- Full audit trail of status changes
- User action logs

### 5.3 Security
- Passwords hashed (bcrypt)
- JWT tokens with 24-hour expiration
- HTTPS only
- Input validation on all fields
- SQL injection prevention

### 5.4 Browser Support
- Modern browsers only (Chrome, Firefox, Safari, Edge - latest 2 versions)

---

## 6. What's Explicitly OUT of Scope (Phase 2+)

These are important but NOT in MVP:

- ❌ File attachments
- ❌ Email notifications
- ❌ CRM integration
- ❌ Support ticket integration
- ❌ SSO / OAuth
- ❌ Tags and themes
- ❌ Priority scoring
- ❌ Duplicate detection
- ❌ Merge functionality
- ❌ Advanced analytics
- ❌ Custom reports
- ❌ Export functionality
- ❌ Saved views
- ❌ Mobile app
- ❌ Real-time updates
- ❌ Activity feed
- ❌ Email ingestion
- ❌ Webhooks
- ❌ API rate limiting (beyond basic)
- ❌ Customer self-service portal

---

## 7. MVP Timeline

**Week 1-2:** Foundation
- Database schema
- Authentication system
- Basic CRUD for feedback
- User management

**Week 3-4:** Core Features
- Search and filters
- Comments system
- Status workflow
- Customer management

**Week 5-6:** Polish & Deploy
- Dashboard
- Testing
- Bug fixes
- Documentation
- Deployment

---

## 8. Success Metrics (3 Months Post-Launch)

- 80% of team actively using the platform weekly
- Average 10+ new feedback items per week
- Search used in 50%+ of sessions
- Less than 2% of feedback still tracked in spreadsheets
- Team satisfaction score: 7+/10

---

## 9. Post-MVP Roadmap (Tentative)

**Phase 2 (Months 2-3):**
- File attachments
- Tags
- Email notifications
- Export to CSV

**Phase 3 (Months 4-6):**
- SSO integration
- Priority scoring
- Themes/grouping
- Advanced analytics

**Phase 4 (Months 6+):**
- CRM integration
- Support ticket integration
- Customer portal
- Webhooks/API expansion

---

## 10. Open Questions

1. Should we allow feedback without a customer association?
2. Do we need to track who last modified feedback?
3. Should status change require a comment/note?
4. Maximum length for feedback description?

---

**Approved By:** [Pending]  
**Next Steps:** Technical specification, database design, development sprint planning

---

