import { redirect } from 'next/navigation';

// This is a server component that redirects to login
// Client-side auth checks happen in individual page components
export default function Home() {
  // Server-side redirect to login
  // Client pages will handle auth checks via ProtectedRoute wrapper
  redirect('/login');
}
