'use client';

import { authClient } from '@/api/client/auth-client';
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

    const checkSession = React.useCallback(async () => {
      try {
        const me = await userClient.Me();
        if (me.genericResponse?.statusCode === 403) {
          const refreshed = await authClient.Refresh();
          if (refreshed.genericResponse?.statusCode === 403 || refreshed.error) {
            setState({ user: null, error: "Session expired", isLoading: false });
            return;
          }

          const retry = await userClient.Me();

          if (retry.genericResponse?.statusCode === 200 && retry.genericResponse?.data) {
            setState({
              user: retry.genericResponse.data,
              error: null,
              isLoading: false
            });
            return;
          }

          setState({ user: null, error: "Failed to load user after refresh", isLoading: false });
          return;
        }

        if (me.error) {
          setState({ user: null, error: me.error, isLoading: false });
          return;
        }

        if (me.genericResponse?.statusCode === 200) {
          setState({
            user: me.genericResponse.data!,
            error: null,
            isLoading: false
          });
          return;
        }

        setState({ user: null, error: "Unexpected response", isLoading: false });
      } catch (e) {
        setState({ user: null, error: "Something went wrong", isLoading: false });
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