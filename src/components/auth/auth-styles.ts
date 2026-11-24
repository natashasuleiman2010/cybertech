import { StyleSheet } from 'react-native';

import { colors, fontSizes, radius, spacing } from '@/theme';

// Shared styling for the sign-in, sign-up, and forgot-password screens,
// which all follow the same simple form layout.
export const authStyles = StyleSheet.create({
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
  linkButton: {
    minHeight: 44,
    justifyContent: 'center',
  },
  linkText: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.text,
  },
});
