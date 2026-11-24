import { useSignUp } from '@clerk/expo';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput } from 'react-native';

import { authStyles as styles } from '@/components/auth/auth-styles';
import { colors } from '@/theme';

export default function SignUpScreen() {
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
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>Enter the verification code we sent to {email}.</Text>
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="Verification code"
          placeholderTextColor={colors.text}
          style={styles.input}
          keyboardType="number-pad"
          accessibilityLabel="Verification code"
        />
        {errors.fields.code?.message && <Text style={styles.error}>{errors.fields.code.message}</Text>}
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
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
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
        style={[styles.button, (isSubmitting || !email.trim() || !password) && styles.buttonDisabled]}
        onPress={handleSignUp}
      >
        <Text style={styles.buttonText}>{isSubmitting ? 'Signing up…' : 'Sign up'}</Text>
      </Pressable>
      <Pressable
        accessibilityLabel="Log in instead"
        accessibilityRole="button"
        style={styles.linkButton}
        onPress={() => router.push('/sign-in')}
      >
        <Text style={styles.linkText}>Already have an account? Log in</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
