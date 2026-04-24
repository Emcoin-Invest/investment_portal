# Investment Client Portal & Admin Backoffice

A production-ready secure investment platform built with Next.js, TypeScript, Tailwind CSS, and Firebase. Provides separate client and admin experiences with role-based access control, portfolio management, and comprehensive request handling.

## 🎯 Features

### Client Portal
- **Dashboard**: Real-time portfolio summary, performance metrics, and key holdings overview
- **Portfolio**: Detailed asset allocation with interactive charts and historical breakdown
- **Statements**: Secure access to account statements with download capability
- **Service Requests**: Submit and track investment requests (buy, sell, subscribe, withdraw)

### Admin Portal
- **Dashboard**: Comprehensive overview of all clients, total AUM, and recent activity
- **Client Management**: Create, view, and manage individual client accounts and status
- **Product Management**: Define investment products with flexible pricing modes
- **Request Management**: Review, approve, reject, or execute client service requests
- **Portfolio Management**: Manage client portfolio positions and holdings (expandable)
- **Pricing Management**: Update manual prices for non-market instruments (expandable)
- **Statement Management**: Upload and manage client account statements (expandable)

### Security & Access Control
- **Role-Based Access Control**: Strict separation between client and admin experiences
- **Firebase Authentication**: Email/password and Google sign-in support
- **Protected Routes**: Client-side and server-side route protection
- **Data Isolation**: Clients can only access their own data
- **Firestore Security Rules**: Comprehensive rules ensuring data privacy and integrity
- **Storage Rules**: Secure access to statement files based on user role

## 🛠️ Technology Stack

- **Frontend**: Next.js 16 with App Router
- **Language**: TypeScript for type safety
- **Styling**: Tailwind CSS 4 with custom theming
- **Authentication**: Firebase Authentication
- **Database**: Firestore (NoSQL)
- **Storage**: Firebase Storage
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React for clean, professional icons

## 📋 Prerequisites

- Node.js 18+ and pnpm
- Firebase project (free tier supported)
- Modern web browser

## 🚀 Quick Start

### 1. Clone and Install

```bash
cd investment_portal
pnpm install
```

### 2. Firebase Setup

1. Create a Firebase project at [console.firebase.google.com](https://console.firebase.google.com)
2. Enable Firebase services:
   - **Authentication**: Email/Password and Google providers
   - **Firestore Database**: Production mode
   - **Cloud Storage**: Production mode
3. Get your Firebase config from Project Settings > Your Apps > Web App

### 3. Environment Configuration

The Firebase credentials are automatically configured via environment variables. No manual `.env` file creation needed.

### 4. Deploy Security Rules

```bash
# Firestore Rules
1. Go to Firebase Console > Firestore Database > Rules
2. Copy contents of firestore.rules
3. Paste and publish

# Storage Rules
1. Go to Firebase Console > Storage > Rules
2. Copy contents of storage.rules
3. Paste and publish
```

### 5. Run Development Server

```bash
pnpm dev
```

Access the application at `http://localhost:3000`

## 📊 Firestore Schema

### Collections

**users** - User accounts and roles
- `id`: Firebase Auth UID
- `email`: User email
- `name`: Display name
- `role`: 'client' or 'admin'
- `status`: 'active' or 'suspended'
- `createdAt`, `updatedAt`: Timestamps

**products** - Investment products
- `id`: Product identifier
- `name`: Product name
- `type`: 'stock' | 'crypto' | 'fund' | 'sukuk' | 'private'
- `pricingMode`: 'api' | 'manual'
- `currency`: Currency code
- `isActive`: Boolean status

**portfolioPositions** - Client holdings
- `id`: Position identifier
- `userId`: Client ID
- `productId`: Product ID
- `quantity`: Number of units
- `avgPrice`: Average purchase price
- `createdAt`, `updatedAt`: Timestamps

**prices** - Current product prices
- `id`: Price record ID
- `productId`: Product ID
- `price`: Current price
- `source`: 'manual' | 'api'
- `updatedAt`: Last update

**investmentRequests** - Client requests
- `id`: Request ID
- `userId`: Client ID
- `type`: 'buy' | 'sell' | 'subscribe' | 'withdraw'
- `productId`: Product ID (optional)
- `amount`: Request amount (optional)
- `message`: Request description
- `status`: 'pending' | 'approved' | 'rejected' | 'executed'
- `rejectionReason`: Reason for rejection (optional)
- `createdAt`, `updatedAt`: Timestamps

**statements** - Client statements
- `id`: Statement ID
- `userId`: Client ID
- `period`: Statement period
- `fileUrl`: Storage URL
- `filePath`: Storage path
- `createdAt`: Upload date

**notifications** - User notifications
- `id`: Notification ID
- `userId`: Recipient ID
- `type`: Notification type
- `title`, `message`: Content
- `read`: Read status
- `createdAt`: Creation date

## 🔐 Security Features

### Authentication
- Firebase Authentication with email/password and Google sign-in
- Automatic role assignment on signup (clients by default)
- Session management with automatic logout

### Authorization
- Role-based access control (RBAC)
- Protected routes with automatic redirects
- Firestore security rules enforcing data isolation
- Storage rules restricting file access by user

### Data Protection
- Clients can only view their own data
- Admins have full data access
- All sensitive operations logged
- Timestamps on all records for audit trails

## 📱 Responsive Design

The application is fully responsive and optimized for:
- **Desktop**: Full sidebar navigation and detailed views
- **Tablet**: Adaptive layout with collapsible navigation
- **Mobile**: Touch-friendly interface with mobile-optimized navigation

## 🎨 Design System

### Color Palette
- **Primary**: Blue (#3b82f6) - Actions and highlights
- **Success**: Green (#10b981) - Positive metrics
- **Warning**: Yellow (#f59e0b) - Pending items
- **Error**: Red (#ef4444) - Negative metrics
- **Neutral**: Slate grays - Base colors

### Typography
- **Headings**: Bold, clear hierarchy
- **Body**: Professional sans-serif
- **Mono**: Code and technical values

### Components
- Card-based layouts with soft shadows
- Rounded corners for modern appearance
- Consistent spacing and padding
- Smooth transitions and hover states

## 🔄 Data Flow

### Client Portal Flow
1. User logs in with email/password or Google
2. System checks Firestore for user role
3. Redirects to `/client/dashboard`
4. Client views portfolio, statements, and requests
5. Client submits new requests
6. Admin reviews and updates request status
7. Client receives notifications of status changes

### Admin Portal Flow
1. Admin logs in
2. Redirects to `/admin/dashboard`
3. Admin views all clients and metrics
4. Admin manages products, clients, and requests
5. Admin approves/rejects client requests
6. System updates portfolio and sends notifications

## 📈 Key Calculations

### Portfolio Metrics
- **Position Value**: `quantity × currentPrice`
- **Unrealized P&L**: `(currentPrice - avgPrice) × quantity`
- **Total Portfolio Value**: Sum of all position values
- **Asset Allocation**: Percentage breakdown by product type
- **P&L Percentage**: `(unrealizedPnL / totalCost) × 100`

## 🚢 Deployment

### Firebase Hosting
```bash
pnpm build
firebase deploy
```

### Vercel
```bash
vercel
```

### Custom Server
```bash
pnpm build
pnpm start
```

## 📚 File Structure

```
src/
├── app/                    # Next.js App Router
│   ├── client/            # Client portal routes
│   ├── admin/             # Admin portal routes
│   ├── login/             # Authentication
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── ClientLayout.tsx
│   ├── AdminLayout.tsx
│   └── ProtectedRoute.tsx
├── contexts/              # React contexts
│   └── AuthContext.tsx
├── lib/                   # Utilities and services
│   ├── firebase.ts
│   ├── firestore.ts
│   ├── types.ts
│   └── routeProtection.ts
└── ...
```

## 🔧 Configuration

### Firebase Configuration
Environment variables are automatically injected:
- `NEXT_PUBLIC_FIREBASE_API_KEY`
- `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN`
- `NEXT_PUBLIC_FIREBASE_PROJECT_ID`
- `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET`
- `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID`
- `NEXT_PUBLIC_FIREBASE_APP_ID`

## 🧪 Testing

### Demo Accounts
Create these accounts in Firebase Authentication for testing:

**Client Account:**
- Email: `client@example.com`
- Password: `password123`
- Role: Set to 'client' in Firestore

**Admin Account:**
- Email: `admin@example.com`
- Password: `password123`
- Role: Set to 'admin' in Firestore

## 📖 Documentation

- See [SETUP.md](./SETUP.md) for detailed setup instructions
- See [firestore.rules](./firestore.rules) for database security rules
- See [storage.rules](./storage.rules) for storage security rules

## 🤝 Contributing

This is a proprietary project. Internal contributions follow the existing code style and architecture patterns.

## 📄 License

Proprietary and confidential.

## 🆘 Support

For issues or questions:
1. Check the SETUP.md documentation
2. Review Firebase Console logs
3. Verify Firestore security rules are deployed
4. Ensure Firebase credentials are correctly configured

## 🎯 Future Enhancements

- Cloud Functions for automated request processing
- Email notifications for request status updates
- Advanced reporting and analytics
- Multi-currency support
- API integrations for real-time pricing
- Mobile app (React Native)
- Dark mode support
- Two-factor authentication
