import { expect, jest, test } from "@jest/globals";
import { createSessionStorage } from '../session-storage';

function store() {
  const values = new Map<string, string>();
  return {
    getItem: jest.fn(async (key: string) => values.get(key) ?? null),
    setItem: jest.fn(async (key: string, value: string) => { values.set(key, value); }),
    removeItem: jest.fn(async (key: string) => { values.delete(key); }),
  };
}

test('large credentials round trip through bounded secure chunks and remove completely', async () => {
  const secure = store();
  const storage = createSessionStorage(secure);
  const value = 'private credentials é'.repeat(500);
  await storage.setItem('session', value);
  expect(await storage.getItem('session')).toBe(value);
  expect(secure.setItem.mock.calls.every(([, chunk]) => chunk.length <= 400)).toBe(true);
  await storage.removeItem('session');
  expect(await storage.getItem('session')).toBeNull();
});

test('secure storage failure rejects without a plaintext fallback', async () => {
  const secure = store();
  secure.setItem.mockRejectedValue(new Error('keychain unavailable'));
  const storage = createSessionStorage(secure);
  await expect(storage.setItem('session', 'secret'.repeat(2000))).rejects.toThrow('keychain unavailable');
  expect(await storage.getItem('session')).toBeNull();
});

test('failed replacement preserves the last complete session', async () => {
  const secure = store();
  const storage = createSessionStorage(secure);
  await storage.setItem('session', 'old session');
  secure.setItem.mockRejectedValueOnce(new Error('full'));
  await expect(storage.setItem('session', 'new session')).rejects.toThrow('full');
  expect(await storage.getItem('session')).toBe('old session');
});

test('corrupt metadata can still be removed on sign-out', async () => {
  const secure = store();
  await secure.setItem('session', '{broken');
  const storage = createSessionStorage(secure);
  await expect(storage.getItem('session')).rejects.toThrow();
  await storage.removeItem('session');
  expect(await storage.getItem('session')).toBeNull();
});

test('read and deletion failures stay explicit', async () => {
  const secure = store();
  const storage = createSessionStorage(secure);
  secure.getItem.mockRejectedValueOnce(new Error('device locked'));
  await expect(storage.getItem('session')).rejects.toThrow('device locked');
  await storage.setItem('session', 'private');
  secure.removeItem.mockRejectedValueOnce(new Error('keychain unavailable'));
  await expect(storage.removeItem('session')).rejects.toThrow('keychain unavailable');
});
