import { useSSO } from '@clerk/expo';
import * as AuthSession from 'expo-auth-session';
import * as WebBrowser from 'expo-web-browser';
import { useCallback, useEffect, useState } from 'react';
import { Platform, Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, fontSizes, radius, spacing } from '@/theme';

WebBrowser.maybeCompleteAuthSession();

// Preloads the browser on Android so the OAuth redirect returns reliably.
function useWarmUpBrowser() {
  useEffect(() => {
    if (Platform.OS !== 'android') return;
    void WebBrowser.warmUpAsync();
    return () => {
      void WebBrowser.coolDownAsync();
    };
  }, []);
}

export default function SignInScreen() {
  useWarmUpBrowser();
  const { startSSOFlow } = useSSO();
  const [isSigningIn, setIsSigningIn] = useState(false);

  const handleGoogleSignIn = useCallback(async () => {
    setIsSigningIn(true);
    try {
      const redirectUrl = AuthSession.makeRedirectUri({ scheme: 'cybertech', path: '/home' });
      if (__DEV__) {
        // Must be added to the Clerk Dashboard under Redirect URLs, or the
        // session will never be created after Google redirects back.
        console.log('Clerk OAuth redirect URL:', redirectUrl);
      }
      const { createdSessionId, setActive } = await startSSOFlow({
        strategy: 'oauth_google',
        redirectUrl,
      });

      if (createdSessionId && setActive) {
        await setActive({ session: createdSessionId });
      }
    } catch {
      // The user may have cancelled, or the network may be unavailable.
    } finally {
      setIsSigningIn(false);
    }
  }, [startSSOFlow]);

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Sign in</Text>
      <Text style={styles.subtitle}>Sign in with Google to get started.</Text>
      <Pressable
        accessibilityLabel="Sign in with Google"
        accessibilityRole="button"
        disabled={isSigningIn}
        style={[styles.button, isSigningIn && styles.buttonDisabled]}
        onPress={handleGoogleSignIn}
      >
        <Text style={styles.buttonText}>
          {isSigningIn ? 'Signing in…' : 'Continue with Google'}
        </Text>
      </Pressable>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    gap: spacing.sm,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.text,
  },
  subtitle: {
    fontSize: fontSizes.md,
    color: colors.text,
    textAlign: 'center',
  },
  button: {
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: spacing.md,
  },
  buttonDisabled: {
    opacity: 0.6,
  },
  buttonText: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.background,
  },
});
