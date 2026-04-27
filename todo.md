# Investment Portal - Firebase → Local Backend Migration

## Phase 1: Backend Setup
- [ ] Remove Firebase dependencies from package.json
- [ ] Set up Express.js server
- [ ] Configure SQLite database with better-sqlite3
- [ ] Implement JWT authentication middleware
- [ ] Create database connection and initialization

## Phase 2: Database Schema
- [ ] Create users table (id, email, password, name, role, createdAt)
- [ ] Create clients table (id, userId, accountNumber, status)
- [ ] Create products table (id, name, description, category, riskLevel)
- [ ] Create portfolios table (id, clientId, productId, quantity, purchasePrice, purchaseDate)
- [ ] Create holdings table (id, portfolioId, symbol, quantity, price, value)
- [ ] Create requests table (id, clientId, type, status, amount, description, createdAt, updatedAt)
- [ ] Create statements table (id, clientId, fileName, fileUrl, uploadedAt)
- [ ] Create notifications table (id, userId, type, title, message, read, createdAt)
- [ ] Seed initial admin user and sample data

## Phase 3: Authentication API
- [ ] POST /api/auth/register - User registration with password hashing
- [ ] POST /api/auth/login - User login with JWT token generation
- [ ] POST /api/auth/logout - User logout (token blacklist)
- [ ] GET /api/auth/me - Get current user from JWT
- [ ] POST /api/auth/refresh - Refresh JWT token
- [ ] Implement JWT middleware for route protection

## Phase 4: Client Portal API
- [ ] GET /api/client/dashboard - Dashboard summary (portfolio value, performance)
- [ ] GET /api/client/portfolio - Portfolio holdings with calculations
- [ ] GET /api/client/statements - List client statements
- [ ] GET /api/client/statements/:id/download - Download statement file
- [ ] GET /api/client/requests - List client requests
- [ ] POST /api/client/requests - Create new request
- [ ] GET /api/client/notifications - List client notifications
- [ ] PUT /api/client/notifications/:id/read - Mark notification as read

## Phase 5: Admin Portal API
- [ ] GET /api/admin/dashboard - Admin dashboard (total AUM, client count, recent activity)
- [ ] GET /api/admin/clients - List all clients with pagination
- [ ] GET /api/admin/clients/:id - Get client details with portfolio
- [ ] POST /api/admin/clients - Create new client
- [ ] PUT /api/admin/clients/:id - Update client information
- [ ] GET /api/admin/products - List all products
- [ ] POST /api/admin/products - Create new product
- [ ] PUT /api/admin/products/:id - Update product
- [ ] DELETE /api/admin/products/:id - Delete product
- [ ] GET /api/admin/pricing - List pricing tiers
- [ ] POST /api/admin/pricing - Create pricing tier
- [ ] GET /api/admin/requests - List all requests with filtering
- [ ] PUT /api/admin/requests/:id/approve - Approve request with notification
- [ ] PUT /api/admin/requests/:id/reject - Reject request with notification
- [ ] GET /api/admin/statements - List all statements
- [ ] POST /api/admin/statements - Upload statement file
- [ ] GET /api/admin/notifications - List admin notifications

## Phase 6: Frontend Updates
- [ ] Remove all Firebase imports
- [ ] Update AuthContext to use Express API
- [ ] Replace Firestore queries with API calls
- [ ] Update environment variables (.env.local)
- [ ] Remove Firebase configuration file
- [ ] Update all pages to use new API endpoints

## Phase 7: Testing & Verification
- [ ] Test user registration and login flow
- [ ] Test client portal (dashboard, portfolio, requests)
- [ ] Test admin portal (clients, products, requests)
- [ ] Test notifications system
- [ ] Test file uploads and downloads
- [ ] Test role-based access control
- [ ] Test error handling and validation

## Phase 8: Documentation & Deployment
- [ ] Create API documentation
- [ ] Create database schema documentation
- [ ] Create setup guide for local development
- [ ] Create docker-compose for containerization
- [ ] Create production deployment guide
