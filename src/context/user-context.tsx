'use client';

import { userClient } from '@/api/client/user-client';
import { User } from '@/types/user-type';
import * as React from 'react';


export interface UserContextValue {
  user: User | null;
  error: string | null;
  isLoading: boolean;
  checkSession: () => Promise<void>;
}

export const UserContext = React.createContext<UserContextValue | undefined>(undefined);

export interface UserProviderProps {
  children: React.ReactNode;
}

export function UserProvider(
    { children }: UserProviderProps
): React.JSX.Element {
    const [state, setState] = React.useState<{ user: User | null; error: string | null; isLoading: boolean }>({
        user: null,
        error: null,
        isLoading: true,
    });

    const checkSession = React.useCallback(async (): Promise<void> => {      
        try {
            const { data, error } = await userClient.Me();
            if (error) {
                setState((prev) => ({ ...prev, user: null, error: error, isLoading: false }));
                return;
            }

            setState((prev) => ({ ...prev, user: data ?? null, error: null, isLoading: false }));

        } catch (e) {
            setState((prev) => ({ ...prev, user: null, error: 'Something went wrong', isLoading: false }));
            return;
        }
    }, []);

  React.useEffect(() => {
    checkSession().catch((error) => {
      console.error(error);
      // noop
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps -- Expected
  }, []);

  return <UserContext.Provider value={{ ...state, checkSession }}>{children}</UserContext.Provider>;
}

export const UserConsumer = UserContext.Consumer;