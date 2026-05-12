import { z } from 'zod';

// Auth schemas
export const loginSchema = z.object({
  email: z.string().email('Invalid email address'),
  password: z.string().min(6, 'Password must be at least 6 characters'),
});

export const registerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  password: z.string().min(8, 'Password must be at least 8 characters'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"],
});

// Portfolio schemas
export const addPositionSchema = z.object({
  productId: z.number().positive('Product ID must be positive'),
  quantity: z.number().positive('Quantity must be positive'),
  purchasePrice: z.number().positive('Purchase price must be positive'),
});

// Request schemas
export const createRequestSchema = z.object({
  title: z.string().min(3, 'Title must be at least 3 characters'),
  description: z.string().min(10, 'Description must be at least 10 characters'),
  priority: z.enum(['low', 'medium', 'high']),
});

// Type exports
export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
export type AddPositionInput = z.infer<typeof addPositionSchema>;
export type CreateRequestInput = z.infer<typeof createRequestSchema>;
