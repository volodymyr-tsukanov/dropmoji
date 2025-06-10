/*
 Copyright (C) 2025  volodymyr-tsukanov  dropmoji
 for the full copyright notice see the LICENSE file in the root of repository
*/
'use client'
import { Children, cloneElement, isValidElement, useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { SessionManager } from '@/lib/sec/client';
import { AExtendSession } from '@/app/actions';


export interface IProtectedPageProps {
  sessionManager?: SessionManager;
};


export async function checkAuth(manager: SessionManager): Promise<boolean> {
  const token = manager.token;
  if (!token) return false;
  try {
    const extendedToken = await AExtendSession(token);
    if (extendedToken) {
      manager.resetToken(extendedToken);
      return true;
    } else {
      manager.invalidateToken();
    }
  } catch (err) {
    console.error('Session extension failed', err);
  }
  return false;
}


export default function ProtectedRoute({
  children,
}: {
  children: React.ReactNode;
}) {
  const [manager, setManager] = useState<SessionManager | null>(null);
  const router = useRouter();

  useEffect(() => {
    if (typeof window === 'undefined') return;

    const instance = new SessionManager(window.sessionStorage);
    const token = instance.token;

    if (!token) {
      router.replace('/auth');
    } else {
      setManager(instance);
    }
  }, [router]);

  if (!manager) return null; // or loading spinner


  return Children.map(children, (child) => {
    if (isValidElement(child)) {
      return cloneElement(child as React.ReactElement<IProtectedPageProps>, { sessionManager: manager! });
    } else {
      return child;
    }
  });
}
