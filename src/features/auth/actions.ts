import type { SupabaseClient } from '@supabase/supabase-js';

export async function requestCode(client: SupabaseClient, email: string) {
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim())) throw new Error('Enter a valid email address.');
  const { error } = await client.auth.signInWithOtp({ email: email.trim(), options: { shouldCreateUser: true } });
  if (error) throw new Error('We could not send your code. Check your connection and try again in a minute.');
}

export async function verifyCode(client: SupabaseClient, email: string, token: string) {
  if (!/^\d{6,8}$/.test(token.trim())) throw new Error('Enter the code from your email (6 to 8 digits).');
  const { data, error } = await client.auth.verifyOtp({ email: email.trim(), token: token.trim(), type: 'email' });
  if (error || !data.session) throw new Error('That code is invalid or expired. Try again or request a new code.');
  return data.session;
}
