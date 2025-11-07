'use client';

import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Bot } from 'lucide-react';
import { Chatbot } from '@/components/anemo/Chatbot';

export function ChatbotPopup() {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          size="icon"
          className="fixed bottom-6 right-6 h-16 w-16 rounded-full shadow-lg"
        >
          <Bot className="h-8 w-8" />
          <span className="sr-only">Open Chat</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-96 h-[600px] p-0 mr-4 mb-1 flex flex-col rounded-xl shadow-2xl">
        <Chatbot isPopup={true} />
      </PopoverContent>
    </Popover>
  );
}
