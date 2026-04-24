# Investment Portal - Setup and Deployment Guide

## Overview

This is a production-ready investment client portal and admin backoffice built with Next.js, TypeScript, Tailwind CSS, and Firebase. The application provides separate client and admin experiences with role-based access control, portfolio management, and request handling.

## Architecture

### Technology Stack

- **Frontend**: Next.js 16 with TypeScript and Tailwind CSS 4
- **Authentication**: Firebase Authentication
- **Database**: Firestore (NoSQL)
- **Storage**: Firebase Storage
- **Server Logic**: Firebase Cloud Functions (to be implemented)
- **Icons**: Lucide React
- **Charts**: Recharts

### Project Structure

```
src/
├── app/                          # Next.js App Router
│   ├── client/                   # Client portal routes
│   │   ├── dashboard/
│   │   ├── portfolio/
│   │   ├── statements/
│   │   └── requests/
│   ├── admin/                    # Admin portal routes
│   │   ├── dashboard/
│   │   ├── clients/
│   │   ├── products/
│   │   ├── portfolios/
│   │   ├── pricing/
│   │   ├── requests/
│   │   └── statements/
│   ├── login/                    # Authentication
│   ├── unauthorized/             # Access control
│   └── layout.tsx                # Root layout
├── components/
│   ├── ClientLayout.tsx          # Client portal layout
│   ├── AdminLayout.tsx           # Admin portal layout
│   ├── ProtectedRoute.tsx        # Route protection wrapper
│   └── ...                       # Shared components
├── contexts/
│   └── AuthContext.tsx           # Authentication context
├── lib/
│   ├── firebase.ts               # Firebase initialization
│   ├── firestore.ts              # Firestore service layer
│   ├── types.ts                  # TypeScript types
│   └── routeProtection.ts        # Route protection logic
└── ...
```

## Firebase Setup

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a new project"
3. Enter project name: "Investment Portal"
4. Enable Google Analytics (optional)
5. Click "Create project"

### 2. Enable Firebase Services

#### Authentication
1. In Firebase Console, go to **Authentication** > **Sign-in method**
2. Enable **Email/Password** provider
3. (Optional) Enable **Google** provider

#### Firestore Database
1. Go to **Firestore Database**
2. Click **Create database**
3. Start in **Production mode**
4. Choose your region (closest to your users)
5. Click **Create**

#### Cloud Storage
1. Go to **Storage**
2. Click **Get started**
3. Start in **Production mode**
4. Choose your region
5. Click **Done**

### 3. Get Firebase Configuration

1. Go to **Project Settings** (gear icon)
2. Scroll to **Your apps** section
3. Click on the web app (or create one if needed)
4. Copy the Firebase config object
5. Use these values for your environment variables

### 4. Deploy Firestore Security Rules

1. In Firebase Console, go to **Firestore Database** > **Rules**
2. Copy the contents of `firestore.rules` file
3. Paste into the rules editor
4. Click **Publish**

### 5. Deploy Storage Rules

1. In Firebase Console, go to **Storage** > **Rules**
2. Copy the contents of `storage.rules` file
3. Paste into the rules editor
4. Click **Publish**

## Environment Variables

Create a `.env.local` file in the project root with your Firebase configuration:

```
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

## Firestore Schema

### Collections

#### users
- `id` (string): User ID from Firebase Auth
- `email` (string): User email
- `name` (string): User display name
- `role` (string): 'client' or 'admin'
- `status` (string): 'active' or 'suspended'
- `createdAt` (timestamp): Account creation date
- `updatedAt` (timestamp): Last update date

#### products
- `id` (string): Product ID
- `name` (string): Product name
- `type` (string): 'stock', 'crypto', 'fund', 'sukuk', or 'private'
- `pricingMode` (string): 'api' or 'manual'
- `currency` (string): Currency code (e.g., 'USD')
- `isActive` (boolean): Whether product is active
- `createdAt` (timestamp): Creation date

#### portfolioPositions
- `id` (string): Position ID
- `userId` (string): Client user ID
- `productId` (string): Product ID
- `quantity` (number): Number of units held
- `avgPrice` (number): Average purchase price
- `createdAt` (timestamp): Creation date
- `updatedAt` (timestamp): Last update date

#### prices
- `id` (string): Price record ID
- `productId` (string): Product ID
- `price` (number): Current price
- `source` (string): 'manual' or 'api'
- `updatedAt` (timestamp): Last update date

#### investmentRequests
- `id` (string): Request ID
- `userId` (string): Client user ID
- `type` (string): 'buy', 'sell', 'subscribe', or 'withdraw'
- `productId` (string, optional): Product ID
- `amount` (number, optional): Request amount
- `message` (string): Request description
- `status` (string): 'pending', 'approved', 'rejected', or 'executed'
- `rejectionReason` (string, optional): Reason for rejection
- `createdAt` (timestamp): Creation date
- `updatedAt` (timestamp): Last update date

#### statements
- `id` (string): Statement ID
- `userId` (string): Client user ID
- `period` (string): Statement period (e.g., 'Q1 2024')
- `fileUrl` (string): Firebase Storage URL
- `filePath` (string): Storage path
- `createdAt` (timestamp): Upload date

#### notifications
- `id` (string): Notification ID
- `userId` (string): Recipient user ID
- `type` (string): Notification type
- `title` (string): Notification title
- `message` (string): Notification message
- `read` (boolean): Whether notification has been read
- `createdAt` (timestamp): Creation date
- `relatedRequestId` (string, optional): Related request ID

#### auditLogs
- `id` (string): Log ID
- `adminId` (string): Admin user ID
- `action` (string): Action description
- `entityType` (string): Type of entity modified
- `entityId` (string): ID of entity modified
- `changes` (object): Changes made
- `createdAt` (timestamp): Log date

#### priceHistory
- `id` (string): History record ID
- `productId` (string): Product ID
- `price` (number): Price at this point in time
- `source` (string): 'manual' or 'api'
- `createdAt` (timestamp): Record date

## Local Development

### Prerequisites

- Node.js 18+ and pnpm
- Firebase CLI (optional, for local emulation)

### Installation

```bash
# Install dependencies
pnpm install

# Create .env.local with Firebase config
cp .env.example .env.local
# Edit .env.local with your Firebase credentials

# Run development server
pnpm dev
```

The application will be available at `http://localhost:3000`

### Demo Credentials

For testing purposes, create test users in Firebase Authentication:

**Client Account:**
- Email: `client@example.com`
- Password: `password123`
- Role: client (set in Firestore users collection)

**Admin Account:**
- Email: `admin@example.com`
- Password: `password123`
- Role: admin (set in Firestore users collection)

## Features

### Client Portal

- **Dashboard**: Portfolio summary, performance metrics, key holdings
- **Portfolio**: Detailed holdings with asset allocation charts
- **Statements**: Download account statements
- **Requests**: Submit and track investment requests (buy, sell, subscribe, withdraw)

### Admin Portal

- **Dashboard**: Overview of clients, total AUM, pending requests
- **Clients**: Manage client accounts and status
- **Products**: Define investment products and pricing modes
- **Requests**: Review, approve, reject, or execute client requests
- **Portfolios**: Manage client portfolio positions (coming soon)
- **Pricing**: Update manual prices for products (coming soon)
- **Statements**: Upload and manage client statements (coming soon)

## Security

### Role-Based Access Control

- **Clients**: Can only access their own data and client portal routes
- **Admins**: Can access all data and admin portal routes
- **Public**: Login page and unauthorized page only

### Firestore Security Rules

- Clients can read only their own documents
- Admins can read and write all documents
- Unauthenticated users cannot access any data
- Storage files are protected by user ID

### Data Isolation

- Portfolio positions are filtered by user ID
- Requests are filtered by user ID
- Statements are filtered by user ID
- Notifications are filtered by user ID

## Cloud Functions (To Be Implemented)

The following Cloud Functions should be implemented for production:

1. **onRequestCreated**: Triggered when a client submits a request
   - Validate request payload
   - Set timestamps
   - Send notification to admin
   - Create audit log

2. **onRequestStatusChanged**: Triggered when admin updates request status
   - Send notification to client
   - Create audit log
   - Update related portfolio positions (if executed)

3. **onPriceUpdated**: Triggered when admin updates a product price
   - Create price history record
   - Calculate portfolio value changes
   - Create audit log

## Deployment

### Deploy to Firebase Hosting

```bash
# Build the Next.js application
pnpm build

# Install Firebase CLI
npm install -g firebase-tools

# Login to Firebase
firebase login

# Initialize Firebase hosting
firebase init hosting

# Deploy
firebase deploy
```

### Deploy to Vercel (Alternative)

```bash
# Install Vercel CLI
npm install -g vercel

# Deploy
vercel
```

## Monitoring and Maintenance

### Firestore Indexes

For optimal query performance, create composite indexes for:
- `investmentRequests`: userId + status + createdAt
- `portfolioPositions`: userId + productId
- `statements`: userId + createdAt
- `notifications`: userId + read + createdAt

### Backup Strategy

- Enable Firestore automated backups (7-day retention)
- Regularly export important data
- Test restore procedures quarterly

### Performance Optimization

- Enable Firestore caching on client
- Implement pagination for large lists
- Use Cloud CDN for static assets
- Monitor query performance in Firebase Console

## Troubleshooting

### Authentication Issues

- Verify Firebase configuration in `.env.local`
- Check that Firebase Authentication is enabled
- Ensure user documents exist in Firestore with correct role

### Firestore Access Denied

- Review security rules in Firebase Console
- Verify user authentication state
- Check that user has correct role in Firestore

### Storage Access Issues

- Verify Storage rules are deployed
- Ensure file paths match security rules
- Check user ID in file path

## Support and Documentation

- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Documentation](https://firebase.google.com/docs)
- [Tailwind CSS Documentation](https://tailwindcss.com/docs)
- [Recharts Documentation](https://recharts.org/)

## License

This project is proprietary and confidential.
