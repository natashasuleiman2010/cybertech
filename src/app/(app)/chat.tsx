import { useAuth } from '@clerk/expo';
import { router } from 'expo-router';
import { useCallback, useRef, useState } from 'react';
import { FlatList, KeyboardAvoidingView, Platform, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { ChatBubble } from '@/components/chat/chat-bubble';
import { ChatErrorBanner } from '@/components/chat/chat-error-banner';
import { ChatInputBar } from '@/components/chat/chat-input-bar';
import { TypingIndicator } from '@/components/chat/typing-indicator';
import type { ChatMessage } from '@/components/chat/types';
import { colors, spacing } from '@/theme';

const INITIAL_MESSAGE: ChatMessage = {
  id: 'intro',
  role: 'assistant',
  text: "Hi, I'm here to help you think this through. Was it repeated?",
};

function splitSummaryAndNextStep(reply: string): { summary: string; nextStep: string } | null {
  const match = reply.match(/next step:\s*([\s\S]*)/i);
  if (!match) return null;

  const summary = reply.slice(0, match.index).trim();
  const nextStep = match[1].trim();
  if (!summary || !nextStep) return null;

  return { summary, nextStep };
}

export default function ChatScreen() {
  const { getToken } = useAuth();
  const [messages, setMessages] = useState<ChatMessage[]>([INITIAL_MESSAGE]);
  const [isTyping, setIsTyping] = useState(false);
  const [hasError, setHasError] = useState(false);
  const listRef = useRef<FlatList<ChatMessage>>(null);
  const pendingHistoryRef = useRef<ChatMessage[] | null>(null);

  const sendToAssistant = useCallback(
    async (history: ChatMessage[]) => {
      pendingHistoryRef.current = history;
      setHasError(false);
      setIsTyping(true);

      try {
        const token = await getToken();
        const response = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
          body: JSON.stringify({
            messages: history.map(({ role, text }) => ({ role, text })),
          }),
        });
        if (!response.ok) throw new Error('chat request failed');

        const data = await response.json();
        const reply: string = data.reply ?? '';

        setIsTyping(false);
        pendingHistoryRef.current = null;

        const result = splitSummaryAndNextStep(reply);
        if (result) {
          router.push({ pathname: '/result', params: result });
          return;
        }

        setMessages((prev) => [...prev, { id: `${Date.now()}-reply`, role: 'assistant', text: reply }]);
      } catch {
        setIsTyping(false);
        setHasError(true);
      }
    },
    [getToken],
  );

  const handleSend = (text: string) => {
    if (isTyping) return;
    const userMessage: ChatMessage = { id: `${Date.now()}`, role: 'user', text };
    const history = [...messages, userMessage];
    setMessages(history);
    sendToAssistant(history);
  };

  const handleRetry = () => {
    if (pendingHistoryRef.current) {
      sendToAssistant(pendingHistoryRef.current);
    }
  };

  return (
    <SafeAreaView style={styles.container} edges={['top', 'bottom']}>
      <KeyboardAvoidingView style={styles.flex} behavior={Platform.OS === 'ios' ? 'padding' : 'height'}>
        <FlatList
          ref={listRef}
          data={messages}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ChatBubble message={item} />}
          contentContainerStyle={styles.listContent}
          onContentSizeChange={() => listRef.current?.scrollToEnd({ animated: true })}
          ListFooterComponent={
            isTyping ? (
              <TypingIndicator />
            ) : hasError ? (
              <ChatErrorBanner onRetry={handleRetry} />
            ) : undefined
          }
        />
        <ChatInputBar onSend={handleSend} />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.background,
  },
  flex: {
    flex: 1,
  },
  listContent: {
    padding: spacing.md,
    gap: spacing.sm,
  },
});
