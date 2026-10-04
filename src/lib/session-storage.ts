export interface AsyncStorage {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  removeItem(key: string): Promise<void>;
}

type Manifest = { generation: string; count: number };
function manifest(raw: string | null): Manifest | null {
  if (raw === null) return null;
  const value = JSON.parse(raw) as Manifest;
  if (!/^[a-z0-9-]+$/.test(value.generation) || !Number.isInteger(value.count) || value.count < 1 || value.count > 512) {
    throw new Error('Invalid secure session metadata. Please sign in again.');
  }
  return value;
}

export function createSessionStorage(secure: AsyncStorage): AsyncStorage {
  const chunkKey = (key: string, part: Manifest, index: number) => `${key}.${part.generation}.${index}`;
  const removeChunks = async (key: string, part: Manifest | null) => {
    if (part) await Promise.all(Array.from({ length: part.count }, (_, i) => secure.removeItem(chunkKey(key, part, i))));
  };
  return {
    async getItem(key) {
      const part = manifest(await secure.getItem(key));
      if (!part) return null;
      const chunks = await Promise.all(Array.from({ length: part.count }, (_, i) => secure.getItem(chunkKey(key, part, i))));
      if (chunks.some(chunk => chunk === null)) throw new Error('Your saved session is incomplete. Please sign in again.');
      return chunks.join('');
    },
    async setItem(key, value) {
      const previous = manifest(await secure.getItem(key));
      const next = { generation: `${Date.now().toString(36)}-${Math.random().toString(36).slice(2)}`, count: Math.max(1, Math.ceil(value.length / 400)) };
      if (next.count > 512) throw new Error('Session exceeds secure storage capacity.');
      try {
        for (let i = 0; i < next.count; i++) await secure.setItem(chunkKey(key, next, i), value.slice(i * 400, (i + 1) * 400));
        await secure.setItem(key, JSON.stringify(next));
      } catch (error) {
        await removeChunks(key, next).catch(() => undefined);
        throw error;
      }
      await removeChunks(key, previous);
    },
    async removeItem(key) {
      const raw = await secure.getItem(key);
      let part: Manifest | null = null;
      try { part = manifest(raw); } catch { /* corrupt metadata must not prevent signing out */ }
      await secure.removeItem(key);
      await removeChunks(key, part);
    },
  };
}

export function createMemoryStorage(): AsyncStorage {
  const values = new Map<string, string>();
  return {
    getItem: async key => values.get(key) ?? null,
    setItem: async (key, value) => { values.set(key, value); },
    removeItem: async key => { values.delete(key); },
  };
}
