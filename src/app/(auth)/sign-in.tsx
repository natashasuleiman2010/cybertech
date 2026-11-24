import { useSignIn } from '@clerk/expo';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput } from 'react-native';

import { authStyles as styles } from '@/components/auth/auth-styles';
import { colors } from '@/theme';

export default function SignInScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const isSubmitting = fetchStatus === 'fetching';

  const handleSignIn = async () => {
    setFormError(null);
    const { error } = await signIn.password({ emailAddress: email, password });
    if (error) {
      setFormError(error.longMessage ?? error.message);
      return;
    }

    if (signIn.status === 'complete') {
      await signIn.finalize();
      // The (auth) layout redirects to /home once the session becomes active.
    } else {
      setFormError("That didn't work. Please check your details and try again.");
    }
  };

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.title}>Log in</Text>
      <Text style={styles.subtitle}>Welcome back.</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        placeholder="Email"
        placeholderTextColor={colors.text}
        style={styles.input}
        autoCapitalize="none"
        autoComplete="email"
        keyboardType="email-address"
        accessibilityLabel="Email address"
      />
      {errors.fields.identifier?.message && (
        <Text style={styles.error}>{errors.fields.identifier.message}</Text>
      )}
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor={colors.text}
        style={styles.input}
        secureTextEntry
        autoComplete="password"
        accessibilityLabel="Password"
      />
      {errors.fields.password?.message && (
        <Text style={styles.error}>{errors.fields.password.message}</Text>
      )}
      {formError && <Text style={styles.error}>{formError}</Text>}
      <Pressable
        accessibilityLabel="Forgot password"
        accessibilityRole="button"
        style={styles.linkButton}
        onPress={() => router.push('/forgot-password')}
      >
        <Text style={styles.linkText}>Forgot password?</Text>
      </Pressable>
      <Pressable
        accessibilityLabel="Log in"
        accessibilityRole="button"
        disabled={isSubmitting || !email.trim() || !password}
        style={[styles.button, (isSubmitting || !email.trim() || !password) && styles.buttonDisabled]}
        onPress={handleSignIn}
      >
        <Text style={styles.buttonText}>{isSubmitting ? 'Logging in…' : 'Log in'}</Text>
      </Pressable>
      <Pressable
        accessibilityLabel="Create an account"
        accessibilityRole="button"
        style={styles.linkButton}
        onPress={() => router.push('/sign-up')}
      >
        <Text style={styles.linkText}>Don&apos;t have an account? Sign up</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
