import './globals.css';
import { UserProvider } from '@/context/UserContext';
import AuthGuard from '@/components/auth/AuthGuard';

export const metadata = {
  title: 'GuardianX',
  description: 'Built for safety. Designed for freedom.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full bg-gray-100">
      <body className="h-full min-h-screen bg-gray-100">
        <UserProvider>
          <AuthGuard>
            {children}
          </AuthGuard>
        </UserProvider>
      </body>
    </html>
  );
}