import * as functions from 'firebase-functions';
import * as admin from 'firebase-admin';

admin.initializeApp();

const db = admin.firestore();

/**
 * Cloud Function: onRequestCreated
 * Triggered when a new investment request is created
 * - Validates request payload
 * - Sets timestamps
 * - Sends notification to admin
 * - Creates audit log
 */
export const onRequestCreated = functions.firestore
  .document('investmentRequests/{requestId}')
  .onCreate(async (snap, context) => {
    try {
      const request = snap.data();
      const requestId = context.params.requestId;

      // Validate request
      if (!request.userId || !request.type || !request.message) {
        console.error('Invalid request data:', request);
        return;
      }

      // Get user data
      const userDoc = await db.collection('users').doc(request.userId).get();
      if (!userDoc.exists) {
        console.error('User not found:', request.userId);
        return;
      }
      const user = userDoc.data();

      // Find all admins
      const adminsSnapshot = await db
        .collection('users')
        .where('role', '==', 'admin')
        .get();

      // Send notification to all admins
      const batch = db.batch();

      for (const adminDoc of adminsSnapshot.docs) {
        const notificationRef = db.collection('notifications').doc();
        batch.set(notificationRef, {
          userId: adminDoc.id,
          type: 'new_request',
          title: 'New Service Request',
          message: `${user.name} submitted a ${request.type} request`,
          read: false,
          relatedRequestId: requestId,
          createdAt: admin.firestore.FieldValue.serverTimestamp(),
        });
      }

      // Create audit log
      const auditRef = db.collection('auditLogs').doc();
      batch.set(auditRef, {
        action: 'REQUEST_CREATED',
        entityType: 'investmentRequest',
        entityId: requestId,
        userId: request.userId,
        changes: {
          type: request.type,
          status: 'pending',
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      await batch.commit();
      console.log('Request created notification sent:', requestId);
    } catch (error) {
      console.error('Error in onRequestCreated:', error);
      throw error;
    }
  });

/**
 * Cloud Function: onRequestStatusChanged
 * Triggered when request status is updated
 * - Sends notification to client
 * - Creates audit log
 * - Updates portfolio if executed
 */
export const onRequestStatusChanged = functions.firestore
  .document('investmentRequests/{requestId}')
  .onUpdate(async (change, context) => {
    try {
      const before = change.before.data();
      const after = change.after.data();
      const requestId = context.params.requestId;

      // Only process if status changed
      if (before.status === after.status) {
        return;
      }

      // Get user data
      const userDoc = await db.collection('users').doc(after.userId).get();
      if (!userDoc.exists) {
        console.error('User not found:', after.userId);
        return;
      }
      const user = userDoc.data();

      // Send notification to client
      const notificationRef = db.collection('notifications').doc();
      const statusMessages: Record<string, string> = {
        approved: 'Your request has been approved',
        rejected: 'Your request has been rejected',
        executed: 'Your request has been executed',
      };

      await notificationRef.set({
        userId: after.userId,
        type: `request_${after.status}`,
        title: `Request ${after.status.charAt(0).toUpperCase() + after.status.slice(1)}`,
        message: statusMessages[after.status] || 'Your request status has been updated',
        read: false,
        relatedRequestId: requestId,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // Create audit log
      const auditRef = db.collection('auditLogs').doc();
      await auditRef.set({
        action: 'REQUEST_STATUS_CHANGED',
        entityType: 'investmentRequest',
        entityId: requestId,
        changes: {
          status: {
            from: before.status,
            to: after.status,
          },
          rejectionReason: after.rejectionReason || null,
        },
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      // If executed, update portfolio
      if (after.status === 'executed' && before.status !== 'executed') {
        await executeRequest(after, requestId);
      }

      console.log('Request status updated:', requestId, after.status);
    } catch (error) {
      console.error('Error in onRequestStatusChanged:', error);
      throw error;
    }
  });

/**
 * Cloud Function: onPriceUpdated
 * Triggered when a product price is updated
 * - Creates price history record
 * - Calculates portfolio value changes
 * - Creates audit log
 */
export const onPriceUpdated = functions.firestore
  .document('prices/{priceId}')
  .onWrite(async (change, context) => {
    try {
      const after = change.after.data();
      const priceId = context.params.priceId;

      if (!after) {
        return; // Document deleted
      }

      // Create price history record
      const historyRef = db.collection('priceHistory').doc();
      await historyRef.set({
        productId: after.productId,
        price: after.price,
        source: after.source || 'manual',
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
      });

      console.log('Price history created:', priceId);
    } catch (error) {
      console.error('Error in onPriceUpdated:', error);
      throw error;
    }
  });

/**
 * Helper function: executeRequest
 * Processes an executed request and updates portfolio
 */
async function executeRequest(request: any, requestId: string) {
  try {
    if (!request.productId || !request.amount) {
      console.log('Skipping portfolio update: missing productId or amount');
      return;
    }

    // Get current price
    const priceSnapshot = await db
      .collection('prices')
      .where('productId', '==', request.productId)
      .orderBy('updatedAt', 'desc')
      .limit(1)
      .get();

    if (priceSnapshot.empty) {
      console.error('Price not found for product:', request.productId);
      return;
    }

    const price = priceSnapshot.docs[0].data();
    const quantity = request.amount / price.price;

    // Find or create portfolio position
    const positionsSnapshot = await db
      .collection('portfolioPositions')
      .where('userId', '==', request.userId)
      .where('productId', '==', request.productId)
      .get();

    const batch = db.batch();

    if (positionsSnapshot.empty) {
      // Create new position
      const positionRef = db.collection('portfolioPositions').doc();
      batch.set(positionRef, {
        userId: request.userId,
        productId: request.productId,
        quantity: request.type === 'buy' ? quantity : -quantity,
        avgPrice: price.price,
        createdAt: admin.firestore.FieldValue.serverTimestamp(),
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    } else {
      // Update existing position
      const position = positionsSnapshot.docs[0];
      const positionData = position.data();
      const newQuantity =
        request.type === 'buy'
          ? positionData.quantity + quantity
          : positionData.quantity - quantity;

      // Calculate new average price for buy orders
      let newAvgPrice = positionData.avgPrice;
      if (request.type === 'buy' && newQuantity > 0) {
        newAvgPrice =
          (positionData.avgPrice * positionData.quantity + price.price * quantity) /
          newQuantity;
      }

      batch.update(position.ref, {
        quantity: newQuantity,
        avgPrice: newAvgPrice,
        updatedAt: admin.firestore.FieldValue.serverTimestamp(),
      });
    }

    await batch.commit();
    console.log('Portfolio updated for request:', requestId);
  } catch (error) {
    console.error('Error executing request:', error);
    throw error;
  }
}

/**
 * HTTP Function: generateStatement
 * Generates a statement PDF for a client
 * Called by admin to generate statements
 */
export const generateStatement = functions.https.onCall(async (data, context) => {
  try {
    // Verify authentication
    if (!context.auth) {
      throw new functions.https.HttpsError('unauthenticated', 'User must be authenticated');
    }

    // Verify admin role
    const adminDoc = await db.collection('users').doc(context.auth.uid).get();
    if (!adminDoc.exists || adminDoc.data()?.role !== 'admin') {
      throw new functions.https.HttpsError('permission-denied', 'User must be admin');
    }

    const { userId, period } = data;

    if (!userId || !period) {
      throw new functions.https.HttpsError(
        'invalid-argument',
        'userId and period are required'
      );
    }

    // Get user data
    const userDoc = await db.collection('users').doc(userId).get();
    if (!userDoc.exists) {
      throw new functions.https.HttpsError('not-found', 'User not found');
    }

    // Get portfolio positions
    const positionsSnapshot = await db
      .collection('portfolioPositions')
      .where('userId', '==', userId)
      .get();

    // Calculate portfolio value
    let totalValue = 0;
    const positions = [];

    for (const posDoc of positionsSnapshot.docs) {
      const position = posDoc.data();

      // Get latest price
      const priceSnapshot = await db
        .collection('prices')
        .where('productId', '==', position.productId)
        .orderBy('updatedAt', 'desc')
        .limit(1)
        .get();

      if (!priceSnapshot.empty) {
        const price = priceSnapshot.docs[0].data();
        const value = position.quantity * price.price;
        totalValue += value;

        // Get product info
        const productDoc = await db
          .collection('products')
          .doc(position.productId)
          .get();

        positions.push({
          product: productDoc.data()?.name || 'Unknown',
          quantity: position.quantity,
          price: price.price,
          value: value,
        });
      }
    }

    // In a real implementation, generate PDF here
    // For now, just return statement data
    return {
      success: true,
      statement: {
        userId,
        period,
        generatedAt: new Date().toISOString(),
        totalValue,
        positions,
      },
    };
  } catch (error) {
    console.error('Error generating statement:', error);
    throw error;
  }
});

/**
 * Scheduled Function: cleanupOldNotifications
 * Runs daily to clean up old notifications
 */
export const cleanupOldNotifications = functions.pubsub
  .schedule('every day 02:00')
  .timeZone('UTC')
  .onRun(async (context) => {
    try {
      const thirtyDaysAgo = new Date();
      thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

      const snapshot = await db
        .collection('notifications')
        .where('createdAt', '<', thirtyDaysAgo)
        .where('read', '==', true)
        .get();

      const batch = db.batch();
      let count = 0;

      snapshot.docs.forEach((doc) => {
        batch.delete(doc.ref);
        count++;
      });

      if (count > 0) {
        await batch.commit();
        console.log(`Deleted ${count} old notifications`);
      }

      return null;
    } catch (error) {
      console.error('Error cleaning up notifications:', error);
      throw error;
    }
  });
