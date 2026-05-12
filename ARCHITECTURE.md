# Investment Portal - Enterprise Architecture Guide

## Overview

This document describes the refactored architecture of the Investment Portal, transforming it from a functional React dashboard into an enterprise-grade fintech platform MVP.

## Architecture Layers

### 1. **Presentation Layer** (`/src/app`, `/src/components`)
- Next.js 16 with React 19
- Organized into feature-based routes
- Client-side rendering with proper auth guards

### 2. **Feature Layer** (`/src/features`)
The application is organized into self-contained features:

- **auth**: Authentication and authorization
  - LoginForm component
  - RegisterForm component
  - Auth guards and hooks
  
- **dashboard**: Dashboard views and components
  - DashboardStats component
  - Overview and analytics
  
- **portfolio**: Portfolio management
  - PortfolioTable component
  - Position management
  
- **holdings**: Individual holdings view
  
- **statements**: Financial statements
  - Statement list and details
  
- **requests**: Client requests/support tickets
  - RequestsTable component
  - Request management
  
- **admin**: Administrative functions
  - User management
  - Product management
  - System monitoring
  
- **notifications**: Notification system
  - Notification center
  - Real-time alerts

### 3. **Design System** (`/src/design-system`)
Comprehensive component library with:

**Components:**
- Button (variants: primary, secondary, outline, ghost, danger, success)
- Input (with label, error, helper text)
- Card (variants: default, elevated, outlined, filled)
- Badge (status indicators)
- Alert (info, success, warning, error)
- StatCard (KPI cards with trends)
- Skeleton (loading states)
- Table (sortable, paginated)
- Modal (customizable dialogs)

**Theme:**
- Color tokens (primary, success, warning, error, neutral)
- Typography system (h1-h4, body, labels)
- Spacing scale
- Shadows
- Border radius
- Transition utilities

### 4. **API Layer** (`/src/api`)
Modular API services using Axios:

**Services:**
- `auth.service.ts` - Authentication
- `portfolio.service.ts` - Portfolio operations
- `statements.service.ts` - Financial statements
- `requests.service.ts` - Client requests
- `admin.service.ts` - Admin operations
- `products.service.ts` - Product catalog
- `notifications.service.ts` - Notifications

**Client:**
- Axios instance with interceptors
- Automatic token refresh
- Centralized error handling
- Request/response transformation

### 5. **State Management**
- **React Query** (@tanstack/react-query): Data fetching and caching
- **Context API**: Global auth state
- **Zustand**: (prepared for complex state needs)

### 6. **Realtime Foundation** (`/src/services/wsService.ts`)
WebSocket service for real-time updates:
- Auto-reconnect with exponential backoff
- Event-based architecture
- TypeScript-first design
- Integrates with React Query

**Supported Events:**
- Portfolio updates
- Price updates
- Notifications
- Request status changes
- System alerts

### 7. **Hooks** (`/src/hooks`)
Custom React hooks for common patterns:

**API Hooks (useApi.ts):**
- `useCurrentUser()` - Current user data
- `useLogin()` - Login mutation
- `usePortfolio()` - Portfolio data
- `useStatements()` - Statement data
- `useRequests()` - Request data
- `useAdminStats()` - Admin metrics

**Realtime Hooks (useRealtime.ts):**
- `usePortfolioUpdates()` - Portfolio changes
- `usePriceUpdates()` - Price updates
- `useNotificationUpdates()` - New notifications
- `useRequestStatusUpdates()` - Request changes

### 8. **Utilities** (`/src/utils`)
- **helpers.ts**: Common utilities (formatting, calculations)
- **validation.ts**: Zod schemas for form validation
- **constants.ts**: App-wide constants and config

### 9. **Layouts** (`/src/layouts`)
Reusable layout components:
- **Sidebar.tsx** - Navigation sidebar
- **MainLayout.tsx** - Main application layout

### 10. **Types** (`/src/types`)
Centralized TypeScript interfaces:
- User, Auth
- Portfolio, Position
- Product, Market
- Statement, Request
- Notification
- Admin metrics

## Data Flow

```
User Action → Component
    ↓
React Query Hook / Event Handler
    ↓
API Service / WebSocket
    ↓
Axios Client / WebSocket Service
    ↓
Backend API / WebSocket Server
    ↓
Response/Event
    ↓
React Query Cache / Event Listener
    ↓
Component Re-render
```

## Security Features

1. **Token Management**
   - Secure localStorage with token in httpOnly cookie
   - Automatic token refresh
   - 401 error handling

2. **Route Protection**
   - ProtectedRoute component
   - Role-based access (client vs admin)
   - Redirect to login on auth failure

3. **Error Handling**
   - Centralized error formatter
   - User-friendly error messages
   - Error boundaries

4. **CORS**
   - Express backend with CORS configured
   - Secure API endpoints
   - Token validation

## Performance Optimizations

1. **Caching**
   - React Query default 5-minute stale time
   - Automatic cache invalidation
   - Background refetches

2. **Code Splitting**
   - Next.js automatic code splitting
   - Dynamic imports via React.lazy()

3. **Lazy Loading**
   - Images: native lazy loading
   - Components: dynamic imports
   - Routes: Next.js file-based splitting

4. **State Management**
   - Minimal global state
   - Localized component state
   - Efficient re-render boundaries

## Development Workflow

### Project Structure Quick Ref
```
src/
├── app/              # Next.js pages and routes
├── api/              # Axios client and services
├── components/       # Shared components (being phased out)
├── contexts/         # React Context providers
├── design-system/    # UI component library
├── features/         # Feature modules
├── hooks/            # Custom React hooks
├── layouts/          # Layout components
├── lib/              # (legacy, being refactored)
├── services/         # React Query provider, WebSocket
├── types/            # TypeScript definitions
└── utils/            # Utilities: helpers, validation, constants
```

### Creating a New Feature

1. Create feature folder: `src/features/feature-name/`
2. Create components: `components/FeatureComponent.tsx`
3. Add types to `src/types/index.ts`
4. Create API service in `src/api/services/`
5. Create hooks in `src/hooks/useApi.ts`
6. Wire up to routes in `src/app/feature-name/`

### Adding an API Endpoint

1. Create service method in `/src/api/services/[feature].service.ts`
2. Export from `/src/api/services/index.ts`
3. Create React Query hook in `src/hooks/useApi.ts`
4. Use hook in components

## Dependency Reference

### Core
- `next@16.2.4` - React framework
- `react@19` - UI library
- `react-dom@19` - DOM rendering

### State Management & Data
- `@tanstack/react-query@5.28` - Server state management
- (Zustand prepared for client state)

### HTTP & Networking
- `axios@1.6` - HTTP client
- (WebSocket built-in)

### UI & Styling
- `tailwindcss@4` - Utility CSS
- `lucide-react@0.453` - Icons
- `clsx@2.0` - Class name utilities
- `framer-motion@10.16` - Animations (ready to use)

### Validation
- `zod@3.22` - Schema validation

### Form & Authentication
- Express with JWT (backend)
- bcryptjs for hashing

## Future Enhancements

### Phase 9: Advanced Analytics
- Add analytics dashboard
- Chart integration (Recharts ready)
- Real-time metrics

### Phase 10: Trading Features
- Order management
- Live trading interface
- Trade history

### Phase 11: Advanced Notifications
- Desktop notifications
- Email alerts
- SMS integration

### Phase 12: Internationalization
- Multi-language support
- Locale-specific formatting
- RTL support

### Phase 13: Mobile App
- React Native version
- Shared API layer
- OAuth integration

## Monitoring & Observability

### Ready for Integration
- Error tracking: Sentry
- Analytics: GA4, Mixpanel
- Performance: Web Vitals
- Logging: Centralized logging

### Current
- Console logging
- Network tab debugging
- React DevTools

## Testing Strategy

### Prepared For (Future)
- Unit tests: Jest
- Component tests: React Testing Library
- E2E tests: Playwright
- API tests: Vitest

## Deployment

### Current Setup
- Development: `npm run dev`
- Build: `npm run build`
- Start: `npm start`

### Environment Variables
See `.env.example` for all required variables

### Build Optimization
- Next.js optimizations enabled
- Tailwind CSS purged
- Code minified and optimized

## Support & Documentation

- Component docs: Review design-system components
- API docs: Review services in api/services/
- Setup guide: See SETUP.md in root

---

**Last Updated:** May 11, 2026  
**Version:** 1.0.0 - Enterprise Architecture Foundation
