import { expect, jest, test } from '@jest/globals';
import type { SupabaseClient } from '@supabase/supabase-js';
import { requestCode, verifyCode } from '../actions';

test.each(['invalid', 'expired'])('%s code cannot start a session', async () => {
  const client = { auth: { verifyOtp: jest.fn(async () => ({ data: { session: null }, error: new Error('invalid otp') })) } } as unknown as SupabaseClient;
  await expect(verifyCode(client, 'person@example.com', '123456')).rejects.toThrow('invalid or expired');
});

test('valid code returns authenticated session', async () => {
  const session = { user: { id: 'a' }, access_token: 'token' };
  const client = { auth: { verifyOtp: jest.fn(async () => ({ data: { session }, error: null })) } } as unknown as SupabaseClient;
  expect(await verifyCode(client, 'person@example.com', '123456')).toBe(session);
});

test('malformed email is rejected before network access', async () => {
  const send = jest.fn();
  const client = { auth: { signInWithOtp: send } } as unknown as SupabaseClient;
  await expect(requestCode(client, 'not-email')).rejects.toThrow('valid email');
  expect(send).not.toHaveBeenCalled();
});
