// API client for local Express backend
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3002';

export async function getUserPortfolioPositions(userId: string) {
  const response = await fetch(`${API_URL}/api/portfolio?userId=${userId}`);
  if (!response.ok) throw new Error('Failed to fetch portfolio positions');
  return response.json();
}

export async function getLatestPrice(productId: string) {
  const response = await fetch(`${API_URL}/api/prices/latest?productId=${productId}`);
  if (!response.ok) return null;
  return response.json();
}

export async function getAllProducts() {
  const response = await fetch(`${API_URL}/api/products`);
  if (!response.ok) throw new Error('Failed to fetch products');
  return response.json();
}

export async function getUserStatements(userId: string) {
  const response = await fetch(`${API_URL}/api/statements?userId=${userId}`);
  if (!response.ok) throw new Error('Failed to fetch statements');
  return response.json();
}

export async function getUserRequests(userId: string) {
  const response = await fetch(`${API_URL}/api/requests?userId=${userId}`);
  if (!response.ok) throw new Error('Failed to fetch requests');
  return response.json();
}

export async function createRequest(data: any) {
  const response = await fetch(`${API_URL}/api/requests`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create request');
  return response.json();
}

export async function getAllUsers() {
  const response = await fetch(`${API_URL}/api/users`);
  if (!response.ok) throw new Error('Failed to fetch users');
  return response.json();
}

export async function getAllRequests() {
  const response = await fetch(`${API_URL}/api/requests`);
  if (!response.ok) throw new Error('Failed to fetch requests');
  return response.json();
}

export async function getUser(userId: string) {
  const response = await fetch(`${API_URL}/api/users/${userId}`);
  if (!response.ok) throw new Error('Failed to fetch user');
  return response.json();
}

export async function getProduct(productId: string) {
  const response = await fetch(`${API_URL}/api/products/${productId}`);
  if (!response.ok) throw new Error('Failed to fetch product');
  return response.json();
}

export async function updateUser(userId: string, data: any) {
  const response = await fetch(`${API_URL}/api/users/${userId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update user');
  return response.json();
}

export async function createUser(data: any) {
  const response = await fetch(`${API_URL}/api/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create user');
  return response.json();
}

export async function createProduct(data: any) {
  const response = await fetch(`${API_URL}/api/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to create product');
  return response.json();
}

export async function updateProduct(productId: string, data: any) {
  const response = await fetch(`${API_URL}/api/products/${productId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update product');
  return response.json();
}

export async function updateRequest(requestId: string, data: any) {
  const response = await fetch(`${API_URL}/api/requests/${requestId}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  });
  if (!response.ok) throw new Error('Failed to update request');
  return response.json();
}
