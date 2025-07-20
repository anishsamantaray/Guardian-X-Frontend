import './globals.css';
import { UserProvider } from '@/context/UserContext';

export const metadata = {
  title: 'GuardianX',
  description: 'Built for safety. Designed for freedom.',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <UserProvider>
          {children}
        </UserProvider>
      </body>
    </html>
  );
}
