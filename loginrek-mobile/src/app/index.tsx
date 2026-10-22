import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

import { env } from '@/config/env';
import { colors, radius, spacing } from '@/theme/colors';

type Status = 'idle' | 'checking' | 'ok' | 'error';

/**
 * Placeholder layar awal + cek koneksi ke API (GET /health).
 * Ganti dengan alur Login -> Beranda sesuai docs/ARCHITECTURE.md.
 */
export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const [status, setStatus] = useState<Status>('idle');

  async function checkApi() {
    setStatus('checking');
    try {
      const healthUrl = env.apiUrl.replace(/\/api\/v1\/?$/, '/health');
      const res = await fetch(healthUrl, { headers: { Accept: 'application/json' } });
      setStatus(res.ok ? 'ok' : 'error');
    } catch {
      setStatus('error');
    }
  }

  const label: Record<Status, string> = {
    idle: 'Cek koneksi API',
    checking: 'Mengecek…',
    ok: 'API terhubung ✓',
    error: 'Gagal terhubung — coba lagi',
  };

  return (
    <View style={[styles.container, { paddingTop: insets.top + spacing.xl }]}>
      <Text style={styles.title}>loginrek</Text>
      <Text style={styles.subtitle}>Aplikasi absensi karyawan</Text>

      <Pressable
        accessibilityRole="button"
        onPress={checkApi}
        disabled={status === 'checking'}
        style={({ pressed }) => [
          styles.button,
          status === 'error' && styles.buttonError,
          pressed && styles.buttonPressed,
        ]}
      >
        <Text style={styles.buttonText}>{label[status]}</Text>
      </Pressable>

      <Text style={styles.meta}>
        {env.appEnv} · API: {env.apiUrl}
      </Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.xl,
  },
  title: { fontSize: 32, fontWeight: '700', color: colors.primary },
  subtitle: { marginTop: spacing.sm, fontSize: 16, color: colors.text },
  button: {
    marginTop: spacing.xxl,
    minHeight: 56,
    borderRadius: radius.md,
    backgroundColor: colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: spacing.lg,
  },
  buttonPressed: { backgroundColor: colors.primaryDark },
  buttonError: { backgroundColor: colors.danger },
  buttonText: { color: '#FFFFFF', fontSize: 16, fontWeight: '600' },
  meta: { marginTop: spacing.xl, fontSize: 12, color: colors.textMuted },
});
