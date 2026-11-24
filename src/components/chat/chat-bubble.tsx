import { StyleSheet, Text } from 'react-native';
import Animated, { FadeInDown, useReducedMotion } from 'react-native-reanimated';
import Markdown from 'react-native-markdown-display';

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
      {isUser ? (
        <Text style={[styles.text, styles.userText]}>{message.text}</Text>
      ) : (
        <Markdown style={markdownStyles}>{message.text}</Markdown>
      )}
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
});

// Styles for the assistant's markdown replies. react-native-markdown-display
// keys style overrides by node type (body, strong, bullet_list, etc.).
const markdownStyles = StyleSheet.create({
  body: {
    color: colors.text,
    fontSize: fontSizes.md,
  },
  paragraph: {
    marginTop: 0,
    marginBottom: 0,
  },
  strong: {
    fontWeight: '700',
  },
  link: {
    color: colors.accent,
  },
  bullet_list: {
    marginBottom: 0,
  },
  ordered_list: {
    marginBottom: 0,
  },
  code_inline: {
    backgroundColor: colors.background,
    color: colors.text,
    borderRadius: radius.sm,
    paddingHorizontal: spacing.xs,
  },
  code_block: {
    backgroundColor: colors.background,
    color: colors.text,
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
  fence: {
    backgroundColor: colors.background,
    color: colors.text,
    borderRadius: radius.sm,
    padding: spacing.sm,
  },
});
