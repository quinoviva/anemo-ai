'use client';

import { Chatbot } from '@/components/anemo/Chatbot';

export default function ChatbotPage() {
  return (
    <div className="h-full flex flex-col">
      <div className="mb-4">
        <h1 className="text-3xl font-bold tracking-tight">ChatbotAI</h1>
        <p className="text-muted-foreground">
          Ask me anything about anemia. I can assist you in English, Tagalog, and more.
        </p>
      </div>
      <div className="flex-1 min-h-0">
        <Chatbot />
      </div>
    </div>
  );
}
