import { useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';

import { ChatBubble } from '@/components/chat/chat-bubble';
import { ChatInputBar } from '@/components/chat/chat-input-bar';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import type { ChatMessage } from '@/components/chat/types';
import { colors, spacing } from '@/theme';

const INITIAL_MESSAGES: ChatMessage[] = [
  {
    id: '1',
    role: 'assistant',
    text: "Hi, I'm here to help you think this through. Was it repeated?",
  },
  { id: '2', role: 'user', text: 'Yeah, it happened a few times this week.' },
  {
    id: '3',
    role: 'assistant',
    text: "I'm sorry that happened. Did it hurt or make you feel unsafe?",
  },
];

const FAKE_REPLY = 'Thanks for telling me. Was it public, or did other people see it happen?';
const REPLY_DELAY_MS = 1500;

export default function ChatScreen() {
  const [messages, setMessages] = useState<ChatMessage[]>(INITIAL_MESSAGES);
  const [isTyping, setIsTyping] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);

  const handleSend = (text: string) => {
    const userMessage: ChatMessage = { id: `${Date.now()}`, role: 'user', text };
    setMessages((prev) => [...prev, userMessage]);
    setIsTyping(true);

    setTimeout(() => {
      setIsTyping(false);
      setMessages((prev) => [
        ...prev,
        { id: `${Date.now()}-reply`, role: 'assistant', text: FAKE_REPLY },
      ]);
    }, REPLY_DELAY_MS);
  };

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
    >
      <FlatList
        ref={listRef}
        data={messages}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <ChatBubble message={item} />}
        contentContainerStyle={styles.listContent}
        onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
        ListFooterComponent={isTyping ? <TypingIndicator /> : undefined}
      />
      <ChatInputBar onSend={handleSend} />
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },
});
