import { useState } from 'react';
import { Body, Button, Card, Heading, Notice, Screen } from '@/components/ui';
import { useSession } from '@/providers/session-provider';
export default function Settings() {
  const { session, signOut } = useSession();
  const [error, setError] = useState<string | null>(null);
  return <Screen><Heading>Your account</Heading><Card><Body>{session?.user.email}</Body><Button title="Sign out" secondary onPress={() => void signOut().catch(() => setError('Sign-out could not finish. Please retry.'))} />{error && <Notice>{error}</Notice>}</Card></Screen>;
}
