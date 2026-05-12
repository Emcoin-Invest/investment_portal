# Quick Start Guide - Investment Portal Refactored

## 🚀 Getting Started in 5 Minutes

### 1. Install Dependencies
```bash
cd /workspaces/investment_portal
npm install --legacy-peer-deps
```

### 2. Start Development Server
```bash
npm run dev
```

The app will be available at `http://localhost:3001`

### 3. Try It Out
- 🔓 Login page at `/login`
- 👤 Client dashboard at `/client/dashboard`
- ⚙️ Admin dashboard at `/admin/dashboard`

---

## 📚 Key Resources

### Architecture
- **Full Guide:** `ARCHITECTURE.md` - Read this first!
- **Visual Overview:** See folder structure in ARCHITECTURE.md

### Migration & Usage
- **How to Use New System:** `MIGRATION.md`
- **Before/After Examples:** Check MIGRATION.md

### Code Examples

#### Fetching Data with React Query
```typescript
import { usePortfolio } from '@/hooks';

function MyComponent() {
  const { data: portfolio, isLoading } = usePortfolio(userId);
  
  if (isLoading) return <Skeleton />;
  return <div>{portfolio.totalValue}</div>;
}
```

#### Using Design System Components
```typescript
import { Button, Card, StatCard } from '@/design-system/components';
import { TrendingUp } from 'lucide-react';

function MyPage() {
  return (
    <Card padding="lg">
      <StatCard
        title="Portfolio Value"
        value="$10,000"
        icon={<TrendingUp />}
        color="blue"
      />
      <Button variant="primary">Buy Asset</Button>
    </Card>
  );
}
```

#### Creating a New Feature
```typescript
// 1. Add types to src/types/index.ts
// 2. Create service in src/api/services/myfeature.service.ts
// 3. Add hooks to src/hooks/useApi.ts
// 4. Create components in src/features/myfeature/components/
// 5. Wire to routes in src/app/myfeature/
```

#### Real-time Updates
```typescript
import { usePortfolioUpdates } from '@/hooks';

function MyComponent() {
  usePortfolioUpdates((data) => {
    console.log('Portfolio updated:', data);
  });
  
  return <div>Portfolio</div>;
}
```

---

## 🎯 Folder Quick Reference

| Folder | Purpose | Example |
|--------|---------|---------|
| `src/app/` | Next.js routes | Pages and layouts |
| `src/api/services/` | API services | `portfolio.service.ts` |
| `src/design-system/` | UI components | Button, Card, etc. |
| `src/features/` | Feature modules | Dashboard, Portfolio |
| `src/hooks/` | Custom hooks | usePortfolio, useLogin |
| `src/layouts/` | Layout components | Sidebar, MainLayout |
| `src/types/` | TypeScript types | All interfaces |
| `src/utils/` | Utilities | Helpers, validation |
| `src/contexts/` | React contexts | AuthContext |
| `src/services/` | Global services | QueryProvider, WebSocket |

---

## 🛠️ Common Tasks

### Add New API Endpoint
1. Create service in `src/api/services/[feature].service.ts`
2. Add React Query hook in `src/hooks/useApi.ts`
3. Use hook in component: `const { data } = useMyData()`

### Create New Component
1. Place in `src/features/[feature]/components/`
2. Use design system components for styling
3. Use hooks for data fetching
4. Export from feature's `index.ts`

### Add Loading State
```typescript
import { Skeleton, SkeletonCard } from '@/design-system/components';

// Auto-loading with design components
<Table data={data} isLoading={isLoading} />

// Manual skeleton
{isLoading ? <SkeletonCard /> : <Content />}
```

### Handle Errors
```typescript
import { Alert } from '@/design-system/components';

{error && <Alert type="error">{error.message}</Alert>}
```

### Format Data
```typescript
import { formatCurrency, formatDate, formatPercentage } from '@/utils';

<span>{formatCurrency(1000)}</span>  {/* $1,000.00 */}
<span>{formatDate(date)}</span>      {/* May 11, 2026 */}
<span>{formatPercentage(0.052)}</span> {/* 5.20% */}
```

---

## 🔍 Project Structure

```
investment_portal/
├── src/
│   ├── app/                 # Next.js pages
│   ├── api/                 # API layer (Axios + services)
│   ├── design-system/       # UI component library
│   ├── features/            # Feature modules
│   ├── hooks/               # React hooks
│   ├── layouts/             # Layout components
│   ├── services/            # Global services (React Query, WebSocket)
│   ├── types/               # TypeScript types
│   ├── utils/               # Utilities
│   └── contexts/            # React contexts
├── public/                  # Static files
├── ARCHITECTURE.md          # Full architecture guide
├── MIGRATION.md             # How to migrate existing code
├── REFACTORING_SUMMARY.md   # What was refactored
└── package.json             # Dependencies
```

---

## 📖 Understanding the Flow

### Data Fetching
```
Component
  ↓
usePortfolio() hook
  ↓
React Query
  ↓
portfolioService.getUserPortfolio()
  ↓
Axios Client
  ↓
Backend API
  ↓
Cache/State Update
  ↓
Component Re-render
```

### Real-time Updates
```
WebSocket Server
  ↓
wsService.emit()
  ↓
usePortfolioUpdates() hook
  ↓
React Query invalidation
  ↓
Data refetch
  ↓
Component Re-render
```

---

## ⚙️ Configuration

### Environment Variables
Copy and edit `.env.example`:
```bash
cp .env.example .env.local
```

Key variables:
- `NEXT_PUBLIC_API_URL` - Backend API URL
- `NEXT_PUBLIC_ENABLE_REALTIME` - Enable WebSocket

### TypeScript
- Strict mode enabled
- Path aliases configured (`@/` = `src/`)
- Full type coverage

---

## 🧪 Development Tips

### Debug React Query
React Query DevTools is available in development:
- Mount anywhere in your app
- See query cache in real time
- Manual refetch/reset

### Debug WebSocket
```typescript
// Console logs built-in
// Check browser Network tab → WS
// See messages in console
```

### Check Types
```bash
npm run type-check
```

### Lint Code
```bash
npm run lint
```

---

## 🚨 Troubleshooting

### "Can't find module '@/hooks'"
```bash
# Verify path alias in tsconfig.json - should already be configured
```

### "API calls not working"
1. Check backend is running on port 3002
2. Verify `NEXT_PUBLIC_API_URL` in `.env.local`
3. Check token in localStorage: `localStorage.getItem('token')`
4. See Network tab in DevTools

### "Component not loading"
1. Check if in feature folder: `src/features/[name]/`
2. Verify export in feature's `index.ts`
3. Check import path uses `@/features/`

### "Data not updating in real-time"
1. Verify WebSocket connected: `wsService.isConnected()`
2. Check subscription: `usePortfolioUpdates(callback)`
3. Verify backend is sending events

---

## 📚 Next Steps

1. **Read Architecture Guide**
   - `ARCHITECTURE.md` - Understand the system

2. **Review Examples**
   - `src/features/dashboard/components/DashboardStats.tsx`
   - `src/features/portfolio/components/PortfolioTable.tsx`
   - `src/features/requests/components/RequestsTable.tsx`

3. **Try Migrating a Component**
   - Pick a component from old structure
   - Follow `MIGRATION.md`
   - Use design system components
   - Use React Query hooks

4. **Deploy**
   - Run `npm run build`
   - Check for TypeScript errors
   - Test all flows
   - Deploy to production

---

## 🎓 Learning Path

**Day 1: Foundation**
- [ ] Read ARCHITECTURE.md
- [ ] Understand folder structure
- [ ] Review design system components

**Day 2: API & Hooks**
- [ ] Review API services
- [ ] Learn React Query hooks
- [ ] Try usePortfolio hook

**Day 3: Components**
- [ ] Review feature examples
- [ ] Try design system components
- [ ] Create a small feature

**Day 4: Real-time**
- [ ] Learn WebSocket service
- [ ] Try useRealtime hooks
- [ ] Understand event flow

**Day 5: Production**
- [ ] Review security
- [ ] Optimize performance
- [ ] Deploy to production

---

## 💡 Pro Tips

- ✨ Always use design system components
- 🪝 Prefer hooks over class components
- 🔄 Let React Query handle caching
- 📦 Keep features self-contained
- 🎯 Use TypeScript strict mode
- 📝 Add JSDoc to functions
- 🧪 Write tests (infrastructure ready)
- 🎨 Follow design system guidelines

---

## 🆘 Need Help?

1. **Architecture Questions:** See `ARCHITECTURE.md`
2. **Migration Help:** See `MIGRATION.md`
3. **Component Examples:** Check `src/design-system/components/`
4. **API Examples:** Check `src/api/services/`
5. **Feature Examples:** Check `src/features/`

---

## 📦 Available Scripts

```bash
npm run dev              # Start development server
npm run dev:next        # Start Next.js only
npm run dev:server      # Start Express backend only
npm run build           # Build production bundle
npm start               # Start production server
npm run lint            # Run ESLint
npm run type-check      # Check TypeScript errors
```

---

**Happy coding! 🚀**

Need to deep dive? Start with `ARCHITECTURE.md`  
Need to migrate existing code? Check `MIGRATION.md`  
Want to see it in action? Run `npm run dev` and explore!
