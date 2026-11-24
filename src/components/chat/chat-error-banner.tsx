import { Pressable, StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';

import { colors, fontSizes, radius, spacing } from '@/theme';

type ChatErrorBannerProps = {
  onRetry: () => void;
};

export function ChatErrorBanner({ onRetry }: ChatErrorBannerProps) {
  const reducedMotion = useReducedMotion();

  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeInDown.duration(250)}
      style={styles.bubble}
      accessibilityLabel="Assistant said: I couldn't reply just now"
    >
      <Text style={styles.text}>I couldn&apos;t reply just now.</Text>
      <Pressable
        onPress={onRetry}
        accessibilityRole="button"
        accessibilityLabel="Retry sending message"
        style={styles.retryButton}
      >
        <Text style={styles.retryText}>Retry</Text>
      </Pressable>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    alignSelf: 'flex-start',
    maxWidth: '80%',
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  text: {
    fontSize: fontSizes.md,
    color: colors.text,
  },
  retryButton: {
    alignSelf: 'flex-start',
    minHeight: 44,
    minWidth: 44,
    paddingHorizontal: spacing.md,
    justifyContent: 'center',
    borderRadius: radius.full,
    backgroundColor: colors.accent,
  },
  retryText: {
    color: colors.background,
    fontSize: fontSizes.md,
    fontWeight: '600',
  },
});
