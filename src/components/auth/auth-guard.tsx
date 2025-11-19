'use client';

import { useUser } from '@/hooks/use-user';
import { FrontendPaths } from '@/paths/frontend-paths';
import { useRouter } from 'next/navigation';
import * as React from 'react';

export interface AuthGuardProps {
  children: React.ReactNode;
}

export function AuthGuard({ children }: AuthGuardProps): React.JSX.Element | null {
  const router = useRouter();
  const { user, error, isLoading } = useUser();
  const [isChecking, setIsChecking] = React.useState(true);

  const checkPermissions = async (): Promise<void> => {
    if (isLoading) return;

    if (!user) {
      router.replace(FrontendPaths.auth.signIn);
      return;
    }

    if (error) {
      router.replace(FrontendPaths.auth.signIn);
      return;
    }

    setIsChecking(false);
  };

  React.useEffect(() => {
    checkPermissions().catch(() => {});
  }, [user, error, isLoading]);

  if (isChecking) return null;

  return <>{children}</>;
}
