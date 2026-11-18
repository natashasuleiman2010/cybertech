import { useEffect } from 'react';
import { StyleSheet, View } from 'react-native';
import Animated, {
  cancelAnimation,
  Easing,
  useAnimatedStyle,
  useReducedMotion,
  useSharedValue,
  withDelay,
  withRepeat,
  withSequence,
  withTiming,
} from 'react-native-reanimated';

import { colors, radius, spacing } from '@/theme';

function Dot({ delay, reducedMotion }: { delay: number; reducedMotion: boolean }) {
  const translateY = useSharedValue(0);

  useEffect(() => {
    if (reducedMotion) {
      translateY.value = 0;
      return;
    }
    translateY.value = withDelay(
      delay,
      withRepeat(
        withSequence(
          withTiming(-6, { duration: 280, easing: Easing.out(Easing.ease) }),
          withTiming(0, { duration: 280, easing: Easing.in(Easing.ease) }),
        ),
        -1,
      ),
    );
    return () => cancelAnimation(translateY);
  }, [delay, reducedMotion, translateY]);

  const animatedStyle = useAnimatedStyle(() => ({
    transform: [{ translateY: translateY.value }],
  }));

  return <Animated.View style={[styles.dot, animatedStyle]} />;
}

export function TypingIndicator() {
  const reducedMotion = useReducedMotion();

  return (
    <View
      style={styles.container}
      accessible
      accessibilityLabel="Assistant is typing"
    >
      <Dot delay={0} reducedMotion={reducedMotion} />
      <Dot delay={120} reducedMotion={reducedMotion} />
      <Dot delay={240} reducedMotion={reducedMotion} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    gap: spacing.xs,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: radius.full,
    backgroundColor: colors.text,
  },
});
