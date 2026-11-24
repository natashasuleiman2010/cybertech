import { router, useLocalSearchParams } from 'expo-router';
import { Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';

import { colors, fontSizes, radius, spacing } from '@/theme';

export default function ResultScreen() {
  const { summary, nextStep } = useLocalSearchParams<{ summary?: string; nextStep?: string }>();

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Here&apos;s what we found</Text>
      <Text style={styles.summary}>
        {summary ?? "We couldn't put together a summary this time."}
      </Text>

      <View style={styles.card}>
        <Text style={styles.cardLabel}>Suggested next step</Text>
        <Text style={styles.cardText}>
          {nextStep ?? 'Talk to a trusted adult about what happened.'}
        </Text>
      </View>

      <Text style={styles.disclaimer}>
        This is not a diagnosis or a legal judgment - just a starting point for getting support.
      </Text>

      <Pressable
        accessibilityRole="button"
        accessibilityLabel="Start over"
        style={styles.button}
        onPress={() => router.replace('/chat')}
      >
        <Text style={styles.buttonText}>Start over</Text>
      </Pressable>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    justifyContent: 'center',
    gap: spacing.md,
    backgroundColor: colors.background,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.xl,
  },
  title: {
    fontSize: fontSizes.xl,
    fontWeight: '700',
    color: colors.text,
    textAlign: 'center',
  },
  summary: {
    fontSize: fontSizes.md,
    color: colors.text,
    textAlign: 'center',
  },
  card: {
    gap: spacing.xs,
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
  },
  cardLabel: {
    fontSize: fontSizes.sm,
    fontWeight: '600',
    color: colors.text,
  },
  cardText: {
    fontSize: fontSizes.md,
    color: colors.text,
  },
  disclaimer: {
    fontSize: fontSizes.sm,
    color: colors.text,
    textAlign: 'center',
    opacity: 0.8,
  },
  button: {
    minHeight: 44,
    paddingHorizontal: spacing.lg,
    paddingVertical: spacing.sm,
    borderRadius: radius.full,
    backgroundColor: colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: fontSizes.md,
    fontWeight: '600',
    color: colors.background,
  },
});
