// Auth screen (native implementation below)

import React, { useState } from 'react';
import { useAppStore } from '../context';

import { useNavigation } from '@react-navigation/native';
import { ScrollView, View, Text, TextInput, TouchableOpacity, ActivityIndicator, StyleSheet } from 'react-native';

export default function Auth() {
  const { signIn, signUp, signInWithGoogle, signInWithPhone, verifyOtp } = useAppStore();
  const navigation = useNavigation();
  const [mode, setMode] = useState<'signin' | 'signup' | 'phone'>('signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [gamertag, setGamertag] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [otpSent, setOtpSent] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleAuth = async () => {
    setError('');
    setLoading(true);

    try {
        let result: { error: any } = { error: null };
        if (mode === 'signin') {
            result = await signIn(email, password);
        } else if (mode === 'signup') {
            result = await signUp(email, password, gamertag);
        } else if (mode === 'phone') {
            if (!otpSent) {
                result = await signInWithPhone(phone);
                if (!result.error) setOtpSent(true);
            } else {
                result = await verifyOtp(phone, otp);
            }
        }

        if (result.error) {
            setError(result.error.message);
        } else if (mode !== 'phone' || (mode === 'phone' && otpSent)) {
          navigation.navigate('Home');
        }
    } catch (err: any) {
        setError('Connection interrupted. Try again.');
    } finally {
        setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    try {
        await signInWithGoogle();
      navigation.navigate('Home');
    } catch (err) {
        setError('Google authentication failed.');
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <View style={styles.badge}><Text style={styles.badgeText}>🏆</Text></View>
        <Text style={styles.title}>Nexgen <Text style={{color:'#7c3aed'}}>Arena</Text></Text>
        <Text style={styles.subtitle}>Elevate your game. Connect. Compete. Win.</Text>
      </View>

      <View style={styles.card}>
        <View style={styles.tabBar}>
          <TouchableOpacity activeOpacity={0.85} style={[styles.tab, mode === 'signin' && styles.tabActive]} onPress={() => { setMode('signin'); setOtpSent(false); setError(''); }}>
            <Text style={mode === 'signin' ? styles.tabTextActive : styles.tabText}>Sign In</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} style={[styles.tab, mode === 'signup' && styles.tabActive]} onPress={() => { setMode('signup'); setOtpSent(false); setError(''); }}>
            <Text style={mode === 'signup' ? styles.tabTextActive : styles.tabText}>Join</Text>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.85} style={[styles.tab, mode === 'phone' && styles.tabActive]} onPress={() => { setMode('phone'); setOtpSent(false); setError(''); }}>
            <Text style={mode === 'phone' ? styles.tabTextActive : styles.tabText}>Phone</Text>
          </TouchableOpacity>
        </View>

        {error ? <View style={styles.errorBox}><Text style={styles.errorText}>{error}</Text></View> : null}

        {mode === 'signup' && (
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>Gamertag</Text>
            <TextInput style={styles.input} value={gamertag} onChangeText={setGamertag} placeholder="ProGamer_X" placeholderTextColor="#94a3b8" />
          </View>
        )}

        {(mode === 'signin' || mode === 'signup') && (
          <>
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.label}>Email Relay</Text>
              <TextInput style={styles.input} value={email} onChangeText={setEmail} placeholder="commander@nexgen.gg" placeholderTextColor="#94a3b8" keyboardType="email-address" autoCapitalize="none" />
            </View>
            <View style={{ marginBottom: 12 }}>
              <Text style={styles.label}>Access Token</Text>
              <TextInput style={styles.input} value={password} onChangeText={setPassword} placeholder="••••••••" placeholderTextColor="#94a3b8" secureTextEntry />
            </View>
          </>
        )}

        {mode === 'phone' && (
          <View style={{ marginBottom: 12 }}>
            <Text style={styles.label}>Mobile Uplink</Text>
            <TextInput style={styles.input} value={phone} onChangeText={setPhone} placeholder="+1 234 567 890" placeholderTextColor="#94a3b8" keyboardType="phone-pad" />
            {otpSent && (
              <TextInput style={[styles.input, { marginTop: 8, textAlign: 'center', fontSize: 18, fontWeight: '700' }]} value={otp} onChangeText={setOtp} placeholder="000000" placeholderTextColor="#94a3b8" />
            )}
          </View>
        )}

        <TouchableOpacity disabled={loading} onPress={handleAuth} activeOpacity={0.85} style={styles.submit}>
          {loading ? <ActivityIndicator color="#fff" /> : <Text style={styles.submitText}>{mode === 'phone' ? (otpSent ? 'Finalize Access' : 'Send Uplink') : (mode === 'signin' ? 'Initialize Login' : 'Create Profile')}</Text>}
        </TouchableOpacity>

        <View style={styles.divider} />

        <TouchableOpacity activeOpacity={0.85} onPress={handleGoogleSignIn} style={styles.googleBtn}>
          <Text style={{ color: '#fff', fontWeight: '700' }}>Continue with Google</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.small}>By connecting, you agree to our <Text style={styles.link}>Protocols</Text> and <Text style={styles.link}>Privacy Shield</Text></Text>
    </ScrollView>
  );

const styles = StyleSheet.create({
  container: { flexGrow: 1, justifyContent: 'center', padding: 16, backgroundColor: '#020617' },
  header: { alignItems: 'center', marginBottom: 24 },
  badge: { padding: 16, backgroundColor: '#7c3aed', borderRadius: 24, marginBottom: 8 },
  badgeText: { color: '#fff', fontSize: 26 },
  title: { fontSize: 28, fontWeight: '900', color: '#fff' },
  subtitle: { color: '#94a3b8', marginTop: 4 },
  card: { backgroundColor: '#0f1724', borderRadius: 28, padding: 20 },
  tabBar: { flexDirection: 'row', backgroundColor: '#0b1220', padding: 4, borderRadius: 16, marginBottom: 16 },
  tab: { flex: 1, paddingVertical: 10, alignItems: 'center', borderRadius: 12 },
  tabActive: { backgroundColor: '#7c3aed' },
  tabText: { color: '#94a3b8', fontWeight: '700' },
  tabTextActive: { color: '#fff', fontWeight: '800' },
  label: { fontSize: 10, color: '#94a3b8', fontWeight: '800', marginBottom: 6 },
  input: { backgroundColor: '#0b1220', borderRadius: 12, padding: 12, color: '#fff' },
  submit: { backgroundColor: '#7c3aed', paddingVertical: 14, borderRadius: 14, alignItems: 'center', marginTop: 8 },
  submitText: { color: '#fff', fontWeight: '900' },
  divider: { borderTopWidth: 1, borderTopColor: '#0b1220', marginVertical: 16 },
  googleBtn: { backgroundColor: '#0b1220', padding: 12, borderRadius: 12, alignItems: 'center' },
  small: { textAlign: 'center', color: '#64748b', marginTop: 12, fontSize: 11, fontWeight: '700' },
  link: { textDecorationLine: 'underline', color: '#9ca3af' },
  errorBox: { backgroundColor: '#4c1d1d', padding: 10, borderRadius: 12, marginBottom: 12 },
  errorText: { color: '#fca5a5', fontWeight: '700' }
});
