# Investment Portal - API Documentation

## Overview

The Investment Portal uses Firebase Cloud Functions for backend operations and Firestore for data storage. This document describes the available APIs and how to use them.

## Authentication

All API calls require Firebase Authentication. Include the user's ID token in requests:

```javascript
const token = await user.getIdToken();
const response = await fetch('/api/endpoint', {
  headers: {
    'Authorization': `Bearer ${token}`
  }
});
```

## Cloud Functions

### 1. onRequestCreated

**Trigger**: Firestore document create on `investmentRequests/{requestId}`

**Behavior**:
- Validates request payload
- Sends notification to all admins
- Creates audit log entry

**Example**:
```javascript
// Create a new request
await db.collection('investmentRequests').add({
  userId: currentUser.uid,
  type: 'buy',
  productId: 'AAPL',
  amount: 10000,
  message: 'I would like to buy Apple stock',
  status: 'pending',
  createdAt: new Date(),
  updatedAt: new Date()
});
```

### 2. onRequestStatusChanged

**Trigger**: Firestore document update on `investmentRequests/{requestId}`

**Behavior**:
- Detects status changes
- Sends notification to client
- Creates audit log
- Updates portfolio if status is 'executed'

**Example**:
```javascript
// Update request status
await db.collection('investmentRequests').doc(requestId).update({
  status: 'approved',
  updatedAt: new Date()
});
```

### 3. onPriceUpdated

**Trigger**: Firestore document write on `prices/{priceId}`

**Behavior**:
- Creates price history record
- Tracks price changes over time

**Example**:
```javascript
// Update product price
await db.collection('prices').add({
  productId: 'AAPL',
  price: 150.25,
  source: 'manual',
  updatedAt: new Date()
});
```

### 4. generateStatement

**Type**: Callable Cloud Function

**Authentication**: Required (admin only)

**Parameters**:
- `userId` (string): Client user ID
- `period` (string): Statement period (e.g., "Q1 2024")

**Returns**:
```json
{
  "success": true,
  "statement": {
    "userId": "user123",
    "period": "Q1 2024",
    "generatedAt": "2024-01-15T10:30:00Z",
    "totalValue": 150000,
    "positions": [
      {
        "product": "Apple Inc.",
        "quantity": 100,
        "price": 150.25,
        "value": 15025
      }
    ]
  }
}
```

**Example**:
```javascript
import { httpsCallable } from 'firebase/functions';

const generateStatement = httpsCallable(functions, 'generateStatement');

try {
  const result = await generateStatement({
    userId: 'client123',
    period: 'Q1 2024'
  });
  console.log('Statement:', result.data.statement);
} catch (error) {
  console.error('Error:', error.message);
}
```

### 5. cleanupOldNotifications

**Type**: Scheduled Cloud Function

**Schedule**: Daily at 02:00 UTC

**Behavior**:
- Deletes read notifications older than 30 days
- Runs automatically

## Firestore Collections

### users

**Path**: `/users/{userId}`

**Fields**:
- `id` (string): Firebase Auth UID
- `email` (string): User email
- `name` (string): Display name
- `role` (string): 'client' or 'admin'
- `status` (string): 'active' or 'suspended'
- `createdAt` (timestamp): Account creation date
- `updatedAt` (timestamp): Last update date

**Security**: Users can read their own document; admins can read all

### products

**Path**: `/products/{productId}`

**Fields**:
- `id` (string): Product identifier
- `name` (string): Product name
- `type` (string): 'stock' | 'crypto' | 'fund' | 'sukuk' | 'private'
- `pricingMode` (string): 'api' | 'manual'
- `currency` (string): Currency code
- `isActive` (boolean): Active status
- `createdAt` (timestamp): Creation date

**Security**: Anyone can read; only admins can write

### portfolioPositions

**Path**: `/portfolioPositions/{positionId}`

**Fields**:
- `id` (string): Position identifier
- `userId` (string): Client user ID
- `productId` (string): Product ID
- `quantity` (number): Units held
- `avgPrice` (number): Average purchase price
- `createdAt` (timestamp): Creation date
- `updatedAt` (timestamp): Last update date

**Security**: Users can read their own; admins can read all

### prices

**Path**: `/prices/{priceId}`

**Fields**:
- `id` (string): Price record ID
- `productId` (string): Product ID
- `price` (number): Current price
- `source` (string): 'manual' | 'api'
- `updatedAt` (timestamp): Last update

**Security**: Anyone can read; only admins can write

### investmentRequests

**Path**: `/investmentRequests/{requestId}`

**Fields**:
- `id` (string): Request ID
- `userId` (string): Client user ID
- `type` (string): 'buy' | 'sell' | 'subscribe' | 'withdraw'
- `productId` (string, optional): Product ID
- `amount` (number, optional): Request amount
- `message` (string): Request description
- `status` (string): 'pending' | 'approved' | 'rejected' | 'executed'
- `rejectionReason` (string, optional): Rejection reason
- `createdAt` (timestamp): Creation date
- `updatedAt` (timestamp): Last update date

**Security**: Users can read/write their own; admins can read/write all

### statements

**Path**: `/statements/{statementId}`

**Fields**:
- `id` (string): Statement ID
- `userId` (string): Client user ID
- `period` (string): Statement period
- `fileUrl` (string): Storage URL
- `filePath` (string): Storage path
- `createdAt` (timestamp): Upload date

**Security**: Users can read their own; admins can read all

### notifications

**Path**: `/notifications/{notificationId}`

**Fields**:
- `id` (string): Notification ID
- `userId` (string): Recipient user ID
- `type` (string): Notification type
- `title` (string): Notification title
- `message` (string): Notification message
- `read` (boolean): Read status
- `relatedRequestId` (string, optional): Related request ID
- `createdAt` (timestamp): Creation date

**Security**: Users can read their own; admins can read all

### auditLogs

**Path**: `/auditLogs/{logId}`

**Fields**:
- `id` (string): Log ID
- `action` (string): Action description
- `entityType` (string): Entity type
- `entityId` (string): Entity ID
- `userId` (string): User who made the change
- `changes` (object): Changes made
- `createdAt` (timestamp): Log date

**Security**: Only admins can read

## Common Queries

### Get User's Portfolio

```javascript
const positions = await db
  .collection('portfolioPositions')
  .where('userId', '==', userId)
  .get();
```

### Get Pending Requests

```javascript
const requests = await db
  .collection('investmentRequests')
  .where('status', '==', 'pending')
  .orderBy('createdAt', 'desc')
  .get();
```

### Get User's Notifications

```javascript
const notifications = await db
  .collection('notifications')
  .where('userId', '==', userId)
  .orderBy('createdAt', 'desc')
  .limit(10)
  .get();
```

### Get Product Price History

```javascript
const history = await db
  .collection('priceHistory')
  .where('productId', '==', productId)
  .orderBy('createdAt', 'desc')
  .limit(30)
  .get();
```

## Error Handling

### Common Errors

**Permission Denied**
```
Code: permission-denied
Message: Missing or insufficient permissions
Solution: Check Firestore security rules and user role
```

**Not Found**
```
Code: not-found
Message: Document not found
Solution: Verify document ID and path
```

**Invalid Argument**
```
Code: invalid-argument
Message: Missing required field
Solution: Check request payload
```

**Unauthenticated**
```
Code: unauthenticated
Message: User must be authenticated
Solution: Ensure user is logged in
```

## Rate Limiting

Firestore has built-in rate limiting:
- Read: 50,000 reads per day (free tier)
- Write: 20,000 writes per day (free tier)
- Delete: 20,000 deletes per day (free tier)

For production, upgrade to Blaze plan for pay-as-you-go pricing.

## Best Practices

1. **Use Transactions for Multiple Operations**
   ```javascript
   const batch = db.batch();
   batch.set(ref1, data1);
   batch.update(ref2, data2);
   await batch.commit();
   ```

2. **Index Common Queries**
   - Firestore will suggest indexes for queries
   - Create indexes for frequently used queries

3. **Paginate Large Result Sets**
   ```javascript
   const first = await db.collection('items').limit(10).get();
   const next = await db.collection('items')
     .startAfter(first.docs[first.docs.length - 1])
     .limit(10)
     .get();
   ```

4. **Cache Data on Client**
   ```javascript
   // Enable offline persistence
   await enableIndexedDbPersistence(db);
   ```

5. **Monitor Usage**
   - Check Firebase Console > Usage tab
   - Set up billing alerts
   - Review function execution times

## Support

For API issues:
1. Check Firebase Console logs
2. Review Firestore security rules
3. Verify authentication state
4. Check network requests in browser DevTools
