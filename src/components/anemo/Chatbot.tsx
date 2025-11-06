'use client';

import React, { useState, useRef, useEffect } from 'react';
import { runAnswerAnemiaQuestion } from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Bot, User, Send, Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

type Message = { role: 'user' | 'assistant'; content: string };

export function Chatbot() {
  const [history, setHistory] = useState<Message[]>([
    { role: 'assistant', content: "Hello! I am AnemoCheck's AI assistant. How can I help you today with your questions about anemia?" },
  ]);
  const [userInput, setUserInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();
  const chatBottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [history]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isLoading) return;

    const newHistory: Message[] = [...history, { role: 'user', content: userInput }];
    setHistory(newHistory);
    setUserInput('');
    setIsLoading(true);

    try {
      const result = await runAnswerAnemiaQuestion({
        question: userInput,
      });

      setHistory(prev => [...prev, { role: 'assistant', content: result.answer }]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred.";
      setHistory(prev => [...prev, { role: 'assistant', content: `I'm sorry, but I encountered an error. Please try again. (${errorMessage})` }]);
      toast({
        title: "Chat Error",
        description: errorMessage,
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Card className="h-full flex flex-col">
      <CardContent className="p-4 flex-1 flex flex-col overflow-hidden">
        <ScrollArea className="flex-grow pr-4 -mr-4 mb-4">
          <div className="space-y-4">
            {history.map((msg, i) => (
              <div key={i} className={cn("flex items-start gap-3", msg.role === 'user' ? "justify-end" : "justify-start")}>
                {msg.role === 'assistant' && <Avatar className="h-8 w-8 bg-primary text-primary-foreground"><AvatarFallback><Bot size={18}/></AvatarFallback></Avatar>}
                <div className={cn("max-w-[80%] rounded-lg p-3 text-sm", msg.role === 'assistant' ? "bg-muted" : "bg-primary text-primary-foreground")}>
                  {msg.content}
                </div>
                {msg.role === 'user' && <Avatar className="h-8 w-8"><AvatarFallback><User size={18}/></AvatarFallback></Avatar>}
              </div>
            ))}
            {isLoading && (
              <div className="flex justify-start">
                <div className="rounded-lg p-3 bg-muted">
                  <Loader2 className="h-5 w-5 animate-spin text-primary" />
                </div>
              </div>
            )}
            <div ref={chatBottomRef} />
          </div>
        </ScrollArea>
        <form onSubmit={handleSubmit} className="flex items-center gap-2 border-t pt-4">
          <Input 
            placeholder="Type your question..." 
            value={userInput} 
            onChange={(e) => setUserInput(e.target.value)} 
            disabled={isLoading}
            aria-label="Your question about anemia"
          />
          <Button type="submit" disabled={!userInput.trim() || isLoading} aria-label="Send message">
            <Send size={16} />
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
