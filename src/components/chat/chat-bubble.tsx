import { StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';

import { colors, fontSizes, radius, spacing } from '@/theme';

import type { ChatMessage } from './types';

export function ChatBubble({ message }: { message: ChatMessage }) {
  const reducedMotion = useReducedMotion();
  const isUser = message.role === 'user';

  return (
    <Animated.View
      entering={reducedMotion ? undefined : FadeInDown.duration(250)}
      style={[styles.bubble, isUser ? styles.userBubble : styles.assistantBubble]}
      accessibilityLabel={`${isUser ? 'You' : 'Assistant'} said: ${message.text}`}
    >
      <Text style={[styles.text, isUser ? styles.userText : styles.assistantText]}>
        {message.text}
      </Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  bubble: {
    maxWidth: '80%',
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.sm,
    borderRadius: radius.lg,
  },
  userBubble: {
    alignSelf: 'flex-end',
    backgroundColor: colors.accent,
  },
  assistantBubble: {
    alignSelf: 'flex-start',
    backgroundColor: colors.surface,
  },
  text: {
    fontSize: fontSizes.md,
  },
  userText: {
    color: colors.background,
  },
  assistantText: {
    color: colors.text,
  },
});
