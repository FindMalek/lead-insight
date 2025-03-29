# LeadInsight Project TODO List

## CONTINUE

- [x] Implement <https://ui.shadcn.com/blocks#dashboard-01> for the dashboard.
- [x] Implement `signOut` button in the dashboard.
- [x] Verify the seeder for the `user` table.
- [x] Debug the `hash` and `verify` functions in the `auth.ts`

## Phase 1: Project Setup

- [ ] Create a new GitHub repository for LeadInsight.
- [ ] Initialize the project with a suitable tech stack (e.g., Node.js, React, Prisma, PostgreSQL).
- [ ] Set up environment variables for database connection and API keys.
- [ ] Implement basic project structure with folders for components, pages, and services.

## Phase 2: Database and Models

- [ ] Define Prisma schema for Lead, Step, and Log models.
- [ ] Run Prisma migrations to set up the database schema.
- [ ] Implement basic CRUD operations for Lead model.
- [ ] Implement logging functionality for real-time lead processing.

## Phase 3: CSV Upload and Validation

- [ ] Create a CSV upload component on the home page.
- [ ] Implement CSV file validation to check for required columns.
- [ ] Display error messages for incorrect CSV formats.
- [ ] Parse and store valid CSV data into the database.

## Phase 4: Lead Processing

- [ ] Implement server-side lead processing to handle large CSV files.
- [ ] Integrate AI models (undrstnd-mini-1-beta, undrstnd-reason-agent) for lead decision-making.
- [ ] Generate AI messages for accepted leads.
- [ ] Update lead status and store AI messages in the database.

## Phase 5: Leads Dashboard

- [ ] Create a leads dashboard page to display all processed leads.
- [ ] Implement filtering and sorting options for the leads table.
- [ ] Add functionality to download leads as a CSV file (full or filtered).
- [ ] Implement action button to copy AI-generated message and open Instagram chat.

## Phase 6: Lead Tracking

- [ ] Create a lead tracking page to monitor lead progress.
- [ ] Implement manual tracking for follow status, likes, and message sending.
- [ ] Set up notifications or alerts for upcoming actions.
- [ ] Update lead steps and next action dates in the database.

## Phase 7: Real-Time Logging and Dashboard

- [ ] Implement real-time logging for lead processing.
- [ ] Create a dashboard to track Undrstnd Labs costs in real-time.
- [ ] Display real-time processing status on the lead processing page.

## Phase 8: Testing and Optimization

- [ ] Write unit tests for lead processing and AI integration.
- [ ] Conduct performance testing for handling large CSV files.
- [ ] Optimize database queries and server-side processing.
- [ ] Implement error handling and edge case management.

## Phase 9: Documentation and Deployment

- [ ] Document the project setup, database schema, and API endpoints.
- [ ] Write user guides for CSV upload and lead management.
- [ ] Deploy the application to a staging environment for testing.
- [ ] Prepare for production deployment and monitor for issues.

## Phase 10: Additional Features and Enhancements

- [ ] Discuss and plan additional features with the client.
- [ ] Create separate contracts for additional features.
- [ ] Implement and test additional features after completing the current contract.
- [ ] Monitor and optimize hosting and database costs as needed.
