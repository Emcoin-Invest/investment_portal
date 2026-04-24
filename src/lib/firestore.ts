import {
  collection,
  doc,
  getDoc,
  getDocs,
  setDoc,
  updateDoc,
  deleteDoc,
  query,
  where,
  orderBy,
  limit,
  Query,
  QueryConstraint,
  Timestamp,
  writeBatch,
} from 'firebase/firestore';
import { db } from './firebase';
import type {
  User,
  Product,
  PortfolioPosition,
  Price,
  InvestmentRequest,
  Statement,
  Notification,
  AuditLog,
  PriceHistory,
} from './types';

// ============================================================================
// USERS COLLECTION
// ============================================================================

export const usersCollection = collection(db, 'users');

export async function getUser(userId: string): Promise<User | null> {
  const docRef = doc(db, 'users', userId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return docSnap.data() as User;
}

export async function getUserByEmail(email: string): Promise<User | null> {
  const q = query(usersCollection, where('email', '==', email));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  return querySnapshot.docs[0].data() as User;
}

export async function createUser(userId: string, userData: Omit<User, 'id'>): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await setDoc(userRef, {
    ...userData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

export async function updateUser(userId: string, updates: Partial<User>): Promise<void> {
  const userRef = doc(db, 'users', userId);
  await updateDoc(userRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

export async function getAllUsers(): Promise<User[]> {
  const q = query(usersCollection, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as User);
}

// ============================================================================
// PRODUCTS COLLECTION
// ============================================================================

export const productsCollection = collection(db, 'products');

export async function getProduct(productId: string): Promise<Product | null> {
  const docRef = doc(db, 'products', productId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return docSnap.data() as Product;
}

export async function createProduct(productId: string, productData: Omit<Product, 'id'>): Promise<void> {
  const productRef = doc(db, 'products', productId);
  await setDoc(productRef, {
    ...productData,
    createdAt: Timestamp.now(),
  });
}

export async function updateProduct(productId: string, updates: Partial<Product>): Promise<void> {
  const productRef = doc(db, 'products', productId);
  await updateDoc(productRef, updates);
}

export async function getAllProducts(): Promise<Product[]> {
  const q = query(productsCollection, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as Product);
}

export async function getActiveProducts(): Promise<Product[]> {
  const q = query(productsCollection, where('isActive', '==', true), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as Product);
}

// ============================================================================
// PORTFOLIO POSITIONS COLLECTION
// ============================================================================

export const portfolioPositionsCollection = collection(db, 'portfolioPositions');

export async function getPortfolioPosition(positionId: string): Promise<PortfolioPosition | null> {
  const docRef = doc(db, 'portfolioPositions', positionId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return docSnap.data() as PortfolioPosition;
}

export async function getUserPortfolioPositions(userId: string): Promise<PortfolioPosition[]> {
  const q = query(portfolioPositionsCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as PortfolioPosition);
}

export async function createPortfolioPosition(
  positionId: string,
  positionData: Omit<PortfolioPosition, 'id'>
): Promise<void> {
  const positionRef = doc(db, 'portfolioPositions', positionId);
  await setDoc(positionRef, {
    ...positionData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

export async function updatePortfolioPosition(positionId: string, updates: Partial<PortfolioPosition>): Promise<void> {
  const positionRef = doc(db, 'portfolioPositions', positionId);
  await updateDoc(positionRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

export async function deletePortfolioPosition(positionId: string): Promise<void> {
  const positionRef = doc(db, 'portfolioPositions', positionId);
  await deleteDoc(positionRef);
}

// ============================================================================
// PRICES COLLECTION
// ============================================================================

export const pricesCollection = collection(db, 'prices');

export async function getLatestPrice(productId: string): Promise<Price | null> {
  const q = query(pricesCollection, where('productId', '==', productId), orderBy('updatedAt', 'desc'), limit(1));
  const querySnapshot = await getDocs(q);
  if (querySnapshot.empty) return null;
  return querySnapshot.docs[0].data() as Price;
}

export async function createOrUpdatePrice(priceId: string, priceData: Omit<Price, 'id'>): Promise<void> {
  const priceRef = doc(db, 'prices', priceId);
  await setDoc(priceRef, {
    ...priceData,
    updatedAt: Timestamp.now(),
  });
}

export async function getPricesByProduct(productId: string): Promise<Price[]> {
  const q = query(pricesCollection, where('productId', '==', productId), orderBy('updatedAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as Price);
}

// ============================================================================
// INVESTMENT REQUESTS COLLECTION
// ============================================================================

export const requestsCollection = collection(db, 'investmentRequests');

export async function getRequest(requestId: string): Promise<InvestmentRequest | null> {
  const docRef = doc(db, 'investmentRequests', requestId);
  const docSnap = await getDoc(docRef);
  if (!docSnap.exists()) return null;
  return docSnap.data() as InvestmentRequest;
}

export async function getUserRequests(userId: string): Promise<InvestmentRequest[]> {
  const q = query(requestsCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as InvestmentRequest);
}

export async function getAllRequests(): Promise<InvestmentRequest[]> {
  const q = query(requestsCollection, orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as InvestmentRequest);
}

export async function getRequestsByStatus(status: string): Promise<InvestmentRequest[]> {
  const q = query(requestsCollection, where('status', '==', status), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as InvestmentRequest);
}

export async function createRequest(requestId: string, requestData: Omit<InvestmentRequest, 'id'>): Promise<void> {
  const requestRef = doc(db, 'investmentRequests', requestId);
  await setDoc(requestRef, {
    ...requestData,
    createdAt: Timestamp.now(),
    updatedAt: Timestamp.now(),
  });
}

export async function updateRequest(requestId: string, updates: Partial<InvestmentRequest>): Promise<void> {
  const requestRef = doc(db, 'investmentRequests', requestId);
  await updateDoc(requestRef, {
    ...updates,
    updatedAt: Timestamp.now(),
  });
}

// ============================================================================
// STATEMENTS COLLECTION
// ============================================================================

export const statementsCollection = collection(db, 'statements');

export async function getUserStatements(userId: string): Promise<Statement[]> {
  const q = query(statementsCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as Statement);
}

export async function createStatement(statementId: string, statementData: Omit<Statement, 'id'>): Promise<void> {
  const statementRef = doc(db, 'statements', statementId);
  await setDoc(statementRef, {
    ...statementData,
    createdAt: Timestamp.now(),
  });
}

export async function deleteStatement(statementId: string): Promise<void> {
  const statementRef = doc(db, 'statements', statementId);
  await deleteDoc(statementRef);
}

// ============================================================================
// NOTIFICATIONS COLLECTION
// ============================================================================

export const notificationsCollection = collection(db, 'notifications');

export async function getUserNotifications(userId: string): Promise<Notification[]> {
  const q = query(notificationsCollection, where('userId', '==', userId), orderBy('createdAt', 'desc'));
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as Notification);
}

export async function createNotification(notificationId: string, notificationData: Omit<Notification, 'id'>): Promise<void> {
  const notificationRef = doc(db, 'notifications', notificationId);
  await setDoc(notificationRef, {
    ...notificationData,
    createdAt: Timestamp.now(),
  });
}

export async function markNotificationAsRead(notificationId: string): Promise<void> {
  const notificationRef = doc(db, 'notifications', notificationId);
  await updateDoc(notificationRef, { read: true });
}

export async function deleteNotification(notificationId: string): Promise<void> {
  const notificationRef = doc(db, 'notifications', notificationId);
  await deleteDoc(notificationRef);
}

// ============================================================================
// AUDIT LOGS COLLECTION
// ============================================================================

export const auditLogsCollection = collection(db, 'auditLogs');

export async function createAuditLog(logId: string, logData: Omit<AuditLog, 'id'>): Promise<void> {
  const logRef = doc(db, 'auditLogs', logId);
  await setDoc(logRef, {
    ...logData,
    createdAt: Timestamp.now(),
  });
}

// ============================================================================
// PRICE HISTORY COLLECTION
// ============================================================================

export const priceHistoryCollection = collection(db, 'priceHistory');

export async function getPriceHistoryForProduct(productId: string, limitCount: number = 100): Promise<PriceHistory[]> {
  const q = query(
    priceHistoryCollection,
    where('productId', '==', productId),
    orderBy('createdAt', 'desc'),
    limit(limitCount)
  );
  const querySnapshot = await getDocs(q);
  return querySnapshot.docs.map((doc) => doc.data() as PriceHistory);
}

export async function createPriceHistory(historyId: string, historyData: Omit<PriceHistory, 'id'>): Promise<void> {
  const historyRef = doc(db, 'priceHistory', historyId);
  await setDoc(historyRef, {
    ...historyData,
    createdAt: Timestamp.now(),
  });
}
