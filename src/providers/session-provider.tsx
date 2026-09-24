import type { Session } from '@supabase/supabase-js';
import { createContext, useContext, useEffect, useRef, useState, type PropsWithChildren } from 'react';
import { AppState } from 'react-native';

import { queryClient } from '@/lib/query-client';
import { supabase } from '@/lib/supabase';

type SessionContextValue = {
  session: Session | null;
  loading: boolean;
  error: string | null;
  signOut(): Promise<void>;
};
const SessionContext = createContext<SessionContextValue | null>(null);

export function SessionProvider({ children }: PropsWithChildren) {
  const [session, setSession] = useState<Session | null>(null);
  const [loading, setLoading] = useState(Boolean(supabase));
  const [error, setError] = useState<string | null>(null);
  const userId = useRef<string | null>(null);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    let active = true;
    let revision = 0;
    const accept = (next: Session | null) => {
      if (!active) return;
      if (!next || userId.current !== next.user.id) queryClient.clear();
      userId.current = next?.user.id ?? null;
      setSession(next);
      setLoading(false);
    };
    const { data: { subscription } } = client.auth.onAuthStateChange((_event, next) => {
      revision++;
      accept(next);
    });
    const initialRevision = revision;
    void client.auth.getSession().then(({ data, error: restoreError }) => {
      if (restoreError) throw restoreError;
      if (revision === initialRevision) accept(data.session);
    }).catch(() => {
      if (!active || revision !== initialRevision) return;
      accept(null);
      setError('Your session could not be restored. Please sign in again.');
      void client.auth.signOut({ scope: 'local' }).catch(() => undefined);
    });
    const updateRefresh = (state: string | null | undefined) => {
      if (state === 'active') client.auth.startAutoRefresh();
      else client.auth.stopAutoRefresh();
    };
    updateRefresh(AppState.currentState);
    const listener = AppState.addEventListener('change', updateRefresh);
    return () => { active = false; subscription.unsubscribe(); listener.remove(); client.auth.stopAutoRefresh(); };
  }, []);

  async function signOut() {
    queryClient.clear();
    userId.current = null;
    setSession(null);
    if (!supabase) return;
    const { error: signOutError } = await supabase.auth.signOut({ scope: 'local' });
    if (signOutError) {
      setError('Secure sign-out could not finish. Please retry before leaving this device.');
      throw signOutError;
    }
    setError(null);
  }

  return <SessionContext.Provider value={{ session, loading, error, signOut }}>{children}</SessionContext.Provider>;
}

export function useSession() {
  const value = useContext(SessionContext);
  if (!value) throw new Error('useSession must be used within SessionProvider');
  return value;
}
