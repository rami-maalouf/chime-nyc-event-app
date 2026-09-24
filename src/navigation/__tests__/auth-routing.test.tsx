import { expect, jest, test } from '@jest/globals';
import { renderRouter, screen, waitFor } from 'expo-router/testing-library';
import { Slot } from 'expo-router';
import { Text } from 'react-native';
import type { PropsWithChildren } from 'react';

import RootLayout from '@/app/_layout';

jest.mock('@/global.css', () => ({}));

jest.mock('@/providers/session-provider', () => ({
  SessionProvider: ({ children }: PropsWithChildren) => children,
  useSession: () => ({ session: null, loading: false }),
}));

test('a signed-out cold root launch reaches sign-in', async () => {
  await renderRouter({
    _layout: RootLayout,
    '(auth)/_layout': () => <Slot />,
    '(auth)/sign-in': () => <Text>Sign in to your family</Text>,
    '(tabs)/_layout': () => <Slot />,
    '(tabs)/index': () => <Text>Private calendar</Text>,
  }, { initialUrl: '/' });
  await waitFor(() => expect(screen.getByText('Sign in to your family')).toBeTruthy());
  expect(screen.queryByText('Private calendar')).toBeNull();
});
