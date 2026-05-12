'use client';

import { useRouter } from 'next/navigation';
import { useState, type FormEvent } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { Button, Input, Card, Alert } from '@/design-system/components';

export interface LoginFormProps {}

export function LoginForm({}: LoginFormProps) {
  const router = useRouter();
  const { login, error, loading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setFormError(null);

    try {
      await login(email, password);
      router.push('/dashboard');
    } catch (err) {
      setFormError('Invalid email or password');
    }
  };

  return (
    <Card variant="elevated" padding="lg" className="w-full max-w-md">
      <h1 className="text-2xl font-bold mb-6 text-neutral-900">Login</h1>

      {(error || formError) && (
        <Alert type="error" dismissible className="mb-4">
          {error || formError}
        </Alert>
      )}

      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label="Email"
          type="email"
          placeholder="you@example.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        <Input
          label="Password"
          type="password"
          placeholder="••••••••"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        <Button type="submit" fullWidth isLoading={loading}>
          Sign In
        </Button>
      </form>

      <p className="text-center text-sm text-neutral-600 mt-4">
        Don&apos;t have an account?{' '}
        <a href="/register" className="text-blue-600 hover:text-blue-700 font-medium">
          Sign up
        </a>
      </p>
    </Card>
  );
}
