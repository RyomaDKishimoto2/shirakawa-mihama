import { useRouter } from 'next/router';
import React, { useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import type { Liff } from '@line/liff';

const ProtectedRoute = ({
  children,
  liff,
}: {
  children: React.ReactNode;
  liff: Liff | null;
}) => {
  const router = useRouter();
  const { user } = useAuth();

  useEffect(() => {
    if ((!user.userId && !liff) || (liff && !liff.isLoggedIn())) {
      router.push('/login');
    }
  }, [router, user]);
  return <div>{user ? children : null}</div>;
};

export default ProtectedRoute;
