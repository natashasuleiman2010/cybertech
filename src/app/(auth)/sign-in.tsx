import { useSignUp } from '@clerk/expo';
import { useState } from 'react';
import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
} from 'react-native';

import { colors, fontSizes, radius, spacing } from '@/theme';

export default function SignInScreen() {
  const { signUp, errors, fetchStatus } = useSignUp();
  const [step, setStep] = useState<'form' | 'verify'>('form');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const isSubmitting = fetchStatus === 'fetching';

  const handleSignUp = async () => {
    setFormError(null);
    const { error } = await signUp.password({ emailAddress: email, password });
    if (error) {
      setFormError(error.longMessage ?? error.message);
      return;
    }

    const { error: codeError } = await signUp.verifications.sendEmailCode();
    if (codeError) {
      setFormError(codeError.longMessage ?? codeError.message);
      return;
    }

    setStep('verify');
  };

  const handleVerify = async () => {
    setFormError(null);
    const { error } = await signUp.verifications.verifyEmailCode({ code });
    if (error) {
      setFormError(error.longMessage ?? error.message);
      return;
    }

    if (signUp.status === 'complete') {
      await signUp.finalize();
      // The (auth) layout redirects to /home once the session becomes active.
    } else {
      setFormError("That didn't work. Please check the code and try again.");
    }
  };

  if (step === 'verify') {
    return (
      <KeyboardAvoidingView
        style={styles.container}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>
          Enter the verification code we sent to {email}.
        </Text>
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="Verification code"
          placeholderTextColor={colors.text}
          style={styles.input}
          keyboardType="number-pad"
          accessibilityLabel="Verification code"
        />
        {errors.fields.code?.message && (
          <Text style={styles.error}>{errors.fields.code.message}</Text>
        )}
        {formError && <Text style={styles.error}>{formError}</Text>}
        <Pressable
          accessibilityLabel="Verify code"
          accessibilityRole="button"
          disabled={isSubmitting || !code.trim()}
          style={[styles.button, (isSubmitting || !code.trim()) && styles.buttonDisabled]}
          onPress={handleVerify}
        >
          <Text style={styles.buttonText}>{isSubmitting ? 'Verifying…' : 'Verify'}</Text>
        </Pressable>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <Text style={styles.title}>Sign up</Text>
      <Text style={styles.subtitle}>Create an account to get started.</Text>
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
      {errors.fields.emailAddress?.message && (
        <Text style={styles.error}>{errors.fields.emailAddress.message}</Text>
      )}
      <TextInput
        value={password}
        onChangeText={setPassword}
        placeholder="Password"
        placeholderTextColor={colors.text}
        style={styles.input}
        secureTextEntry
        autoComplete="password-new"
        accessibilityLabel="Password"
      />
      {errors.fields.password?.message && (
        <Text style={styles.error}>{errors.fields.password.message}</Text>
      )}
      {formError && <Text style={styles.error}>{formError}</Text>}
      <Pressable
        accessibilityLabel="Sign up"
        accessibilityRole="button"
        disabled={isSubmitting || !email.trim() || !password}
        style={[
          styles.button,
          (isSubmitting || !email.trim() || !password) && styles.buttonDisabled,
        ]}
        onPress={handleSignUp}
      >
        <Text style={styles.buttonText}>{isSubmitting ? 'Signing up…' : 'Sign up'}</Text>
      </Pressable>
    </KeyboardAvoidingView>
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
    marginBottom: spacing.sm,
  },
  input: {
    width: '100%',
    minHeight: 44,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    color: colors.text,
    fontSize: fontSizes.md,
  },
  error: {
    width: '100%',
    fontSize: fontSizes.sm,
    color: colors.accent,
  },
  button: {
    minHeight: 44,
    minWidth: 44,
    width: '100%',
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
