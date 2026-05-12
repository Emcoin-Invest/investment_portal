# Migration Guide - Investment Portal Refactoring

## Overview

This guide helps developers understand the new architecture and migrate from the old codebase to the refactored system.

## Before & After Examples

### 1. API Calls

**Old Way (using fetch):**
```typescript
// src/lib/api.ts
const response = await fetch(`${API_URL}/api/portfolio?userId=${userId}`);
const data = await response.json();
```

**New Way (using API services):**
```typescript
// src/api/services/portfolio.service.ts
const data = await portfolioService.getUserPortfolio(userId);
```

### 2. Data Fetching

**Old Way (useState + useEffect):**
```typescript
const [portfolio, setPortfolio] = useState(null);
const [loading, setLoading] = useState(true);

useEffect(() => {
  fetchPortfolio().then(data => {
    setPortfolio(data);
    setLoading(false);
  });
}, []);
```

**New Way (React Query):**
```typescript
const { data: portfolio, isLoading } = usePortfolio(userId);
```

Benefits:
- Automatic caching
- Background refetching
- Optimistic updates
- Easy invalidation

### 3. Components

**Old Way (direct fetch in component):**
```typescript
function Dashboard() {
  const [data, setData] = useState(null);
  
  useEffect(() => {
    fetch('/api/stats').then(r => r.json()).then(setData);
  }, []);
  
  return <div>{data?.value}</div>;
}
```

**New Way (hooks + design system):**
```typescript
function Dashboard() {
  const { data, isLoading } = useAdminStats();
  
  return (
    <StatCard
      title="Total Assets"
      value={data?.totalAssets}
      isLoading={isLoading}
      icon={<Wallet />}
    />
  );
}
```

### 4. Styling

**Old Way (inline styles + custom CSS):**
```typescript
<div style={{ padding: '16px', backgroundColor: '#f0f0f0' }}>
  {content}
</div>
```

**New Way (design system + Tailwind):**
```typescript
<Card variant="outlined" padding="md">
  {content}
</Card>
```

### 5. Forms

**Old Way (useState for each field):**
```typescript
const [email, setEmail] = useState('');
const [password, setPassword] = useState('');
const [error, setError] = useState('');

<input 
  value={email} 
  onChange={(e) => setEmail(e.target.value)}
  style={{ border: error ? '1px solid red' : '...' }}
/>
```

**New Way (validation + design system):**
```typescript
const [Email, setEmail] = useState('');
const errors = loginSchema.safeParse({email}).error?.flatten();

<Input
  label="Email"
  value={email}
  onChange={(e) => setEmail(e.target.value)}
  error={errors?.fieldErrors?.email?.[0]}
/>
```

## Step-by-Step Migration

### Step 1: Update Imports

Change from scattered imports to organized imports:

```typescript
// ❌ Old
import { loadingState } from '@/components/LoadingShimmer';
import { apiCall } from '@/lib/api';

// ✅ New
import { usePortfolio } from '@/hooks';
import { Card, Skeleton } from '@/design-system/components';
```

### Step 2: Replace Direct Fetch Calls

```typescript
// ❌ Old
const response = await fetch(`/api/portfolio?userId=${userId}`);
const portfolio = await response.json();

// ✅ New
const { data: portfolio } = usePortfolio(userId);
```

### Step 3: Update Component Styling

```typescript
// ❌ Old - MetricCard.jsx
<div className="metric-card">
  <h3>{title}</h3>
  <p className="value">{value}</p>
</div>

// ✅ New
<StatCard title={title} value={value} color="blue" />
```

### Step 4: Move to Feature Folders

Organize components by feature:

```
Old Structure:
├── components/
│   ├── AdminDashboard.jsx
│   ├── ClientDashboard.jsx
│   ├── Portfolio.jsx
│   └── ...

New Structure:
├── features/
│   ├── admin/components
│   │   └── AdminDashboard.tsx
│   ├── dashboard/components
│   │   └── DashboardStats.tsx
│   ├── portfolio/components
│   │   └── PortfolioTable.tsx
│   └── ...
```

### Step 5: Use React Query Hooks

Replace useState + useEffect patterns:

```typescript
// ❌ Old
function Requests() {
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(false);
  
  useEffect(() => {
    setLoading(true);
    fetch(`/api/requests?userId=${userId}`)
      .then(r => r.json())
      .then(data => {
        setRequests(data);
        setLoading(false);
      });
  }, [userId]);
  
  return <div>{loading ? 'Loading...' : requests.map(...)}</div>;
}

// ✅ New
function Requests() {
  const { data, isLoading } = useUserRequests(userId);
  
  return (
    <Table
      columns={columns}
      data={data?.data || []}
      isLoading={isLoading}
    />
  );
}
```

### Step 6: Implement Real-time Updates

Add real-time functionality:

```typescript
// In component
function portfolioContainer() {
  const { data: portfolio } = usePortfolio(userId);
  
  // Real-time updates
  usePortfolioUpdates((updated) => {
    queryClient.invalidateQueries(['portfolio', userId]);
  });
  
  return <PortfolioTable data={portfolio} />;
}
```

## Common Patterns

### Loading States
```typescript
// Design system handles loading
<Table data={data} isLoading={isLoading} />

// Or use Skeleton
{isLoading ? <Skeleton count={3} /> : <Content />}
```

### Error Handling
```typescript
// Errors are caught in API services
const { data, error, isLoading } = usePortfolio(userId);

if (error) {
  return <Alert type="error">{error.message}</Alert>;
}
```

### Mutations (POST, PUT, DELETE)
```typescript
// Create mutations for write operations
const { mutate: addPosition, isPending } = useAddPosition();

const handleAdd = async (position) => {
  addPosition(position, {
    onSuccess: () => {
      toast.success('Position added');
    },
    onError: (err) => {
      toast.error(err.message);
    },
  });
};
```

### Caching & Invalidation
```typescript
// React Query handles caching automatically
// To refetch when needed:
const queryClient = useQueryClient();

const handleUpdate = async (data) => {
  await updatePosition(data);
  // Invalidate cache to refetch
  queryClient.invalidateQueries(['portfolio']);
};
```

## Performance Tips

1. **Use React Query hooks** - No more manual refetching
2. **Lazy load components** -  `const Component = dynamic(() => import('...'))`
3. **Optimize re-renders** - Use component composition
4. **Cache API responses** - React Query does this automatically
5. **Code splitting** - Next.js handles this automatically

## Testing the Migration

### Before Deployment
1. ✅ Test all authenticated routes
2. ✅ Test data fetching
3. ✅ Test error states
4. ✅ Test loading states
5. ✅ Test real-time updates (if enabled)
6. ✅ Test mobile responsive design

### Browser DevTools Checks
- Network tab: Verify API calls use axios
- React Query DevTools: Check cache state
- Console: No warnings or errors

## Troubleshooting

### Issue: "Can't find usePortfolio"
```typescript
// ✅ Fix: Import from hooks
import { usePortfolio } from '@/hooks';
```

### Issue: "Component not styled correctly"
```typescript
// ✅ Fix: Use design system components
import { Card, Button } from '@/design-system/components';
```

### Issue: "API calls not working"
```typescript
// ✅ Fix: Check apiClient is configured
// Verify token is in localStorage
console.log(localStorage.getItem('token'));
```

### Issue: "WebSocket connecting but not receiving"
```typescript
// ✅ Fix: Subscribe to events
usePortfolioUpdates((data) => {
  console.log('Portfolio updated:', data);
});
```

## Rollback Plan

If issues occur:

1. Keep old branches available
2. API layer is backwards compatible
3. Old fetch calls still work (not recommended)
4. Router structure unchanged

## Getting Help

- 📖 Architecture guide: `ARCHITECTURE.md`
- 🔍 Component directory: `src/design-system/components/`
- 🎯 Feature examples: `src/features/`
- ⚙️ Services: `src/api/services/`

---

**Next Steps:**
1. Review ARCHITECTURE.md
2. Check out feature folder examples
3. Use design system components
4. Migrate one feature at a time
5. Test thoroughly before deployment

Happy refactoring! 🚀
