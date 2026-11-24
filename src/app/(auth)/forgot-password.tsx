import { useSignIn } from '@clerk/expo';
import { router } from 'expo-router';
import { useState } from 'react';
import { KeyboardAvoidingView, Platform, Pressable, Text, TextInput } from 'react-native';

import { authStyles as styles } from '@/components/auth/auth-styles';
import { colors } from '@/theme';

type Step = 'email' | 'code' | 'password';

export default function ForgotPasswordScreen() {
  const { signIn, errors, fetchStatus } = useSignIn();
  const [step, setStep] = useState<Step>('email');
  const [email, setEmail] = useState('');
  const [code, setCode] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [formError, setFormError] = useState<string | null>(null);

  const isSubmitting = fetchStatus === 'fetching';

  const handleSendCode = async () => {
    setFormError(null);
    const { error } = await signIn.create({ identifier: email });
    if (error) {
      setFormError(error.longMessage ?? error.message);
      return;
    }

    const { error: codeError } = await signIn.resetPasswordEmailCode.sendCode();
    if (codeError) {
      setFormError(codeError.longMessage ?? codeError.message);
      return;
    }

    setStep('code');
  };

  const handleVerifyCode = async () => {
    setFormError(null);
    const { error } = await signIn.resetPasswordEmailCode.verifyCode({ code });
    if (error) {
      setFormError(error.longMessage ?? error.message);
      return;
    }

    if (signIn.status === 'needs_new_password') {
      setStep('password');
    } else {
      setFormError("That didn't work. Please check the code and try again.");
    }
  };

  const handleSubmitPassword = async () => {
    setFormError(null);
    const { error } = await signIn.resetPasswordEmailCode.submitPassword({ password: newPassword });
    if (error) {
      setFormError(error.longMessage ?? error.message);
      return;
    }

    if (signIn.status === 'complete') {
      await signIn.finalize();
      // The (auth) layout redirects to /home once the session becomes active.
    } else {
      setFormError("That didn't work. Please try again.");
    }
  };

  if (step === 'code') {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text style={styles.title}>Check your email</Text>
        <Text style={styles.subtitle}>Enter the reset code we sent to {email}.</Text>
        <TextInput
          value={code}
          onChangeText={setCode}
          placeholder="Reset code"
          placeholderTextColor={colors.text}
          style={styles.input}
          keyboardType="number-pad"
          accessibilityLabel="Reset code"
        />
        {errors.fields.code?.message && <Text style={styles.error}>{errors.fields.code.message}</Text>}
        {formError && <Text style={styles.error}>{formError}</Text>}
        <Pressable
          accessibilityLabel="Verify reset code"
          accessibilityRole="button"
          disabled={isSubmitting || !code.trim()}
          style={[styles.button, (isSubmitting || !code.trim()) && styles.buttonDisabled]}
          onPress={handleVerifyCode}
        >
          <Text style={styles.buttonText}>{isSubmitting ? 'Verifying…' : 'Verify'}</Text>
        </Pressable>
      </KeyboardAvoidingView>
    );
  }

  if (step === 'password') {
    return (
      <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <Text style={styles.title}>Set a new password</Text>
        <Text style={styles.subtitle}>Choose a new password for your account.</Text>
        <TextInput
          value={newPassword}
          onChangeText={setNewPassword}
          placeholder="New password"
          placeholderTextColor={colors.text}
          style={styles.input}
          secureTextEntry
          autoComplete="password-new"
          accessibilityLabel="New password"
        />
        {errors.fields.password?.message && (
          <Text style={styles.error}>{errors.fields.password.message}</Text>
        )}
        {formError && <Text style={styles.error}>{formError}</Text>}
        <Pressable
          accessibilityLabel="Save new password"
          accessibilityRole="button"
          disabled={isSubmitting || !newPassword}
          style={[styles.button, (isSubmitting || !newPassword) && styles.buttonDisabled]}
          onPress={handleSubmitPassword}
        >
          <Text style={styles.buttonText}>{isSubmitting ? 'Saving…' : 'Save password'}</Text>
        </Pressable>
      </KeyboardAvoidingView>
    );
  }

  return (
    <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
      <Text style={styles.title}>Reset your password</Text>
      <Text style={styles.subtitle}>Enter your email and we&apos;ll send you a reset code.</Text>
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
      {formError && <Text style={styles.error}>{formError}</Text>}
      <Pressable
        accessibilityLabel="Send reset code"
        accessibilityRole="button"
        disabled={isSubmitting || !email.trim()}
        style={[styles.button, (isSubmitting || !email.trim()) && styles.buttonDisabled]}
        onPress={handleSendCode}
      >
        <Text style={styles.buttonText}>{isSubmitting ? 'Sending…' : 'Send reset code'}</Text>
      </Pressable>
      <Pressable
        accessibilityLabel="Back to log in"
        accessibilityRole="button"
        style={styles.linkButton}
        onPress={() => router.back()}
      >
        <Text style={styles.linkText}>Back to log in</Text>
      </Pressable>
    </KeyboardAvoidingView>
  );
}
