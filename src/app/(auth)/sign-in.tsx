import { useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Body, Button, Card, Field, Heading, Notice, Screen, useAppColors } from '@/components/ui';
import { requestCode, verifyCode } from '@/features/auth/actions';
import { supabase } from '@/lib/supabase';
import { useSession } from '@/providers/session-provider';

export default function SignIn() {
  const colors = useAppColors();
  const { error: sessionError, signOut } = useSession();
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [sent, setSent] = useState(false);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit(resend = false) {
    if (!supabase || busy) return;
    setBusy(true);
    setError(null);
    try {
      if (sent && !resend) await verifyCode(supabase, email, code);
      else { await requestCode(supabase, email); setSent(true); setCode(''); }
    } catch (failure) {
      setError(failure instanceof Error ? failure.message : 'Something went wrong. Please try again.');
    } finally { setBusy(false); }
  }

  return <Screen>
    <View style={styles.brand}>
      <View accessibilityElementsHidden importantForAccessibility="no-hide-descendants" style={[styles.mark, { backgroundColor: colors.backgroundSelected }]}><Text style={{ color: colors.accent, fontSize: 30 }}>c</Text></View>
      <Text style={[styles.brandName, { color: colors.text }]}>chime</Text>
    </View>
    <View style={styles.intro}>
      <Text style={[styles.eyebrow, { color: colors.accent }]}>A LITTLE MORE TOGETHER</Text>
      <Heading>Your family’s plans,{"\n"}in one place.</Heading>
      <Body>Make room for the everyday moments. Share what’s coming up and head out prepared for the weather.</Body>
    </View>
    {!supabase ? <Card>
      <Heading style={{ fontSize: 24 }}>Getting ready for your family</Heading>
      <Body>This app’s private family service hasn’t been connected yet. Sign-in will be available once setup is complete.</Body>
      <Body>Already invited? Keep your invitation code for when the service is ready.</Body>
    </Card> : <Card>
      <Heading style={{ fontSize: 24 }}>{sent ? 'Check your inbox' : 'Welcome to your shared day'}</Heading>
      <Body>{sent ? `Enter the one-time code sent to ${email.trim()}.` : 'Sign in or create an account with your email. No password to remember.'}</Body>
      {!sent ? <Field label="Email address" value={email} onChangeText={setEmail} placeholder="you@example.com" keyboardType="email-address" autoComplete="email" textContentType="emailAddress" autoCapitalize="none" autoCorrect={false} editable={!busy} returnKeyType="go" onSubmitEditing={() => void submit()} /> : <Field label="Email code" value={code} onChangeText={setCode} placeholder="Enter your code" keyboardType="number-pad" autoComplete="one-time-code" textContentType="oneTimeCode" maxLength={8} editable={!busy} onSubmitEditing={() => void submit()} />}
      {(error || sessionError) && <Notice>{error || sessionError}</Notice>}
      <Button title={sent ? 'Continue to your family' : 'Email me a code'} busy={busy} onPress={() => void submit()} />
      {sent && <>
        <Button title="Send a new code" secondary disabled={busy} onPress={() => void submit(true)} />
        <Button title="Use a different email" secondary disabled={busy} onPress={() => { setSent(false); setCode(''); setError(null); }} />
      </>}
      {sessionError && <Button title="Clear saved session" secondary onPress={() => void signOut().catch(() => setError('Could not clear secure storage. Please retry.'))} />}
    </Card>}
    <Body style={styles.privacy}>A private space for your people.{"\n"}Your calendar is shared only with your family.</Body>
  </Screen>;
}
const styles = StyleSheet.create({
  brand: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingTop: 16 },
  mark: { width: 44, height: 44, borderRadius: 14, alignItems: 'center', justifyContent: 'center' },
  brandName: { fontSize: 26, fontWeight: '700', letterSpacing: -1 },
  intro: { gap: 16, paddingTop: 20, paddingBottom: 8 },
  eyebrow: { fontSize: 11, fontWeight: '700', letterSpacing: 2 },
  privacy: { textAlign: 'center', fontSize: 13, paddingBottom: 12 },
});
