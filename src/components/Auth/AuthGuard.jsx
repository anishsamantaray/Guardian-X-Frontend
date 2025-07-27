'use client';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';

export default function AuthGuard({ children }) {
  const router  = useRouter();
  const path    = usePathname();
  const [ok, setOk] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('access_token');
    const PUBLIC = ['/login', '/signup', '/verify'];

    const isPublic = PUBLIC.some(p => path.startsWith(p));

    if (!token && !isPublic) {
      router.replace('/login');
      return;
    }
    if (token && path === '/') {
      router.replace('/home');
      return;
    }
    setOk(true);
  }, [path, router]);

  if (!ok) return null;
  return <>{children}</>;
}
