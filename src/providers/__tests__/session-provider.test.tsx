import { beforeEach, expect, jest, test } from '@jest/globals';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';
import { Text } from 'react-native';

import { queryClient } from '@/lib/query-client';
import { supabase } from '@/lib/supabase';
import { SessionProvider, useSession } from '../session-provider';

jest.mock('@/lib/supabase', () => ({ supabase: { auth: {
  getSession: jest.fn(),
  onAuthStateChange: jest.fn(),
  signOut: jest.fn(),
  startAutoRefresh: jest.fn(),
  stopAutoRefresh: jest.fn(),
} } }));
const auth = supabase!.auth;
const signedIn = { user: { id: 'member-a' } };
let callback: (event: string, session: unknown) => void;
function Probe() {
  const { session, loading, error, signOut } = useSession();
  return <><Text>{loading ? 'restoring' : session?.user.id ?? 'signed out'}</Text><Text>{error}</Text><Text onPress={() => void signOut()}>leave</Text></>;
}
beforeEach(() => {
  jest.clearAllMocks();
  queryClient.clear();
  (auth.onAuthStateChange as jest.Mock).mockImplementation((listener: unknown) => {
    callback = listener as typeof callback;
    return { data: { subscription: { unsubscribe: jest.fn() } } };
  });
  (auth.signOut as jest.Mock).mockImplementation(async () => ({ error: null }));
});

test('private content stays hidden until restoration finishes', async () => {
  let resolve!: (value: unknown) => void;
  (auth.getSession as jest.Mock).mockImplementation(() => new Promise(done => { resolve = done; }));
  await render(<SessionProvider><Probe /></SessionProvider>);
  expect(screen.getByText('restoring')).toBeTruthy();
  expect(screen.queryByText('member-a')).toBeNull();
  await act(async () => resolve({ data: { session: signedIn }, error: null }));
  expect(screen.getByText('member-a')).toBeTruthy();
});

test('failed restore clears private data and remains signed out', async () => {
  queryClient.setQueryData(['family', 'private'], 'secret');
  (auth.getSession as jest.Mock).mockImplementation(async () => ({ data: { session: null }, error: new Error('refresh expired') }));
  await render(<SessionProvider><Probe /></SessionProvider>);
  await waitFor(() => expect(screen.getByText('signed out')).toBeTruthy());
  expect(queryClient.getQueryData(['family', 'private'])).toBeUndefined();
  expect(auth.signOut).toHaveBeenCalledWith({ scope: 'local' });
});

test('account change and sign-out clear cached family state', async () => {
  (auth.getSession as jest.Mock).mockImplementation(async () => ({ data: { session: signedIn }, error: null }));
  await render(<SessionProvider><Probe /></SessionProvider>);
  await waitFor(() => expect(screen.getByText('member-a')).toBeTruthy());
  queryClient.setQueryData(['family'], 'secret');
  await act(async () => callback('SIGNED_IN', { user: { id: 'member-b' } }));
  expect(queryClient.getQueryData(['family'])).toBeUndefined();
  queryClient.setQueryData(['family'], 'other secret');
  await act(async () => callback('SIGNED_OUT', null));
  expect(queryClient.getQueryData(['family'])).toBeUndefined();
  expect(screen.getByText('signed out')).toBeTruthy();
});

test('a late restoration failure cannot sign out a newer authenticated session', async () => {
  let reject!: (reason: Error) => void;
  (auth.getSession as jest.Mock).mockImplementation(() => new Promise((_resolve, fail) => { reject = fail; }));
  await render(<SessionProvider><Probe /></SessionProvider>);
  await act(async () => callback('SIGNED_IN', signedIn));
  await act(async () => reject(new Error('old refresh failed')));
  expect(screen.getByText('member-a')).toBeTruthy();
  expect(auth.signOut).not.toHaveBeenCalled();
});

test('explicit sign-out clears the cache and removes the local credential session', async () => {
  (auth.getSession as jest.Mock).mockImplementation(async () => ({ data: { session: signedIn }, error: null }));
  await render(<SessionProvider><Probe /></SessionProvider>);
  await waitFor(() => expect(screen.getByText('member-a')).toBeTruthy());
  queryClient.setQueryData(['family'], 'private');
  await fireEvent.press(screen.getByText('leave'));
  await waitFor(() => expect(screen.getByText('signed out')).toBeTruthy());
  expect(queryClient.getQueryData(['family'])).toBeUndefined();
  expect(auth.signOut).toHaveBeenCalledWith({ scope: 'local' });
});
