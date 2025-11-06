'use client';

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  runConductDiagnosticInterview,
  runProvidePersonalizedRecommendations,
} from '@/app/actions';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Progress } from '@/components/ui/progress';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useToast } from '@/hooks/use-toast';
import { Bot, User, Send, FileText, Loader2, Sparkles } from 'lucide-react';
import type { PersonalizedRecommendationsOutput } from '@/ai/flows/provide-personalized-recommendations';
import { cn } from '@/lib/utils';

type InterviewStep = 'interview' | 'generatingReport' | 'reportReady';
type Message = { role: 'user' | 'assistant'; content: string };

type DiagnosticInterviewProps = {
    imageDescription: string | null;
    onReset: () => void;
    onAnalysisError: (error: string) => void;
}

export function DiagnosticInterview({ imageDescription, onReset, onAnalysisError }: DiagnosticInterviewProps) {
  const [interviewStep, setInterviewStep] = useState<InterviewStep>('interview');
  const [interviewHistory, setInterviewHistory] = useState<Message[]>([]);
  const [isInterviewComplete, setIsInterviewComplete] = useState(false);
  const [userInput, setUserInput] = useState('');
  const [report, setReport] = useState<PersonalizedRecommendationsOutput | null>(null);
  const [isInterviewLoading, setInterviewLoading] = useState(false);
  const { toast } = useToast();
  const chatBottomRef = useRef<HTMLDivElement>(null);

   useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [interviewHistory]);

  const startInterview = useCallback(async () => {
    if (interviewHistory.length > 0) return;

    setInterviewLoading(true);
    try {
      const result = await runConductDiagnosticInterview({
        userId: 'guest-user',
        imageAnalysisResult: imageDescription || '',
      });
      setInterviewHistory([{ role: 'assistant', content: result.question }]);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "An unknown error occurred starting the interview.";
      onAnalysisError(errorMessage);
      toast({
            title: "Interview Error",
            description: errorMessage,
            variant: "destructive",
      });
    } finally {
      setInterviewLoading(false);
    }
  }, [imageDescription, interviewHistory.length, onAnalysisError, toast]);

  useEffect(() => {
    startInterview();
  }, [startInterview]);

  const handleInterviewSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!userInput.trim() || isInterviewLoading) return;

    const newHistory: Message[] = [...interviewHistory, { role: 'user', content: userInput }];
    setInterviewHistory(newHistory);
    setUserInput('');
    setInterviewLoading(true);

    try {
      const result = await runConductDiagnosticInterview({
        userId: 'guest-user',
        lastResponse: userInput,
        imageAnalysisResult: imageDescription || '',
        profileData: { age: 30, gender: 'female' }, // Example profile data
      });

      if (result.isComplete) {
        setIsInterviewComplete(true);
        setInterviewHistory(prev => [...prev, { role: 'assistant', content: "Thank you for your responses. I'm now generating your personalized report." }]);
        setInterviewStep('generatingReport');
      } else {
        setInterviewHistory(prev => [...prev, { role: 'assistant', content: result.question }]);
      }
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred during the interview.";
        onAnalysisError(errorMessage);
        toast({
            title: "Interview Error",
            description: errorMessage,
            variant: "destructive",
        });
    } finally {
      setInterviewLoading(false);
    }
  };

  const generateReport = useCallback(async () => {
    if (interviewStep !== 'generatingReport') return;

    try {
      const interviewText = interviewHistory.map(m => `${m.role}: ${m.content}`).join('\n');
      const result = await runProvidePersonalizedRecommendations({
        imageAnalysis: imageDescription || 'No description available',
        interviewResponses: interviewText,
        userProfile: 'Age: 30, Gender: Female', // Example profile data
      });
      setReport(result);
      setInterviewStep('reportReady');
      toast({
        title: "Report Generated",
        description: "Your personalized health report is ready.",
      });
    } catch (err) {
        const errorMessage = err instanceof Error ? err.message : "An unknown error occurred while generating the report.";
        onAnalysisError(errorMessage);
        toast({
            title: "Report Generation Error",
            description: errorMessage,
            variant: "destructive",
        });
    }
  }, [interviewStep, imageDescription, interviewHistory, onAnalysisError, toast]);

  useEffect(() => {
    if (interviewStep === 'generatingReport') {
      generateReport();
    }
  }, [interviewStep, generateReport]);


  if (interviewStep === 'interview') {
    return (
        <Card className="flex-1 flex flex-col">
        <CardHeader>
            <CardTitle className="flex items-center gap-2"><Bot /> Diagnostic Interview</CardTitle>
            <CardDescription>Answer the questions to get personalized recommendations.</CardDescription>
        </CardHeader>
        <CardContent className="flex-1 flex flex-col overflow-hidden">
            <ScrollArea className="flex-grow pr-4 -mr-4 mb-4">
                <div className="space-y-4">
                    {interviewHistory.map((msg, i) => (
                    <div key={i} className={cn("flex items-start gap-3", msg.role === 'user' ? "justify-end" : "justify-start")}>
                        {msg.role === 'assistant' && <Avatar className="h-8 w-8"><AvatarFallback><Bot size={18}/></AvatarFallback></Avatar>}
                        <div className={cn("max-w-[80%] rounded-lg p-3 text-sm", msg.role === 'assistant' ? "bg-muted" : "bg-primary text-primary-foreground")}>
                            {msg.content}
                        </div>
                        {msg.role === 'user' && <Avatar className="h-8 w-8"><AvatarFallback><User size={18}/></AvatarFallback></Avatar>}
                    </div>
                    ))}
                    {isInterviewLoading && <div className="flex justify-start"><div className="rounded-lg p-3 bg-muted"><Loader2 className="h-5 w-5 animate-spin" /></div></div>}
                    <div ref={chatBottomRef} />
                </div>
            </ScrollArea>
            <form onSubmit={handleInterviewSubmit} className="flex items-center gap-2 border-t pt-4">
                <Input placeholder="Type your answer..." value={userInput} onChange={(e) => setUserInput(e.target.value)} disabled={isInterviewComplete || isInterviewLoading} />
                <Button type="submit" size="icon" disabled={!userInput.trim() || isInterviewComplete || isInterviewLoading}><Send size={16} /></Button>
            </form>
        </CardContent>
        </Card>
    );
  }

  if (interviewStep === 'generatingReport') {
    return (
        <Card className="flex-1 flex flex-col items-center justify-center">
            <CardHeader className="text-center">
                <CardTitle className="flex items-center gap-2 justify-center"><Sparkles /> Generating Report</CardTitle>
                <CardDescription>Our AI is compiling your personalized health insights.</CardDescription>
            </CardHeader>
            <CardContent>
                <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </CardContent>
        </Card>
    );
  }

  if (interviewStep === 'reportReady' && report) {
    return (
        <Card className="flex-1">
            <CardHeader>
                <CardTitle className="flex items-center gap-2"><FileText /> Anemia Risk Report</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div>
                    <div className="flex justify-between items-center mb-1">
                        <span className="font-medium">Risk Score</span>
                        <span className="font-bold text-xl">{report.riskScore}/100</span>
                    </div>
                    <Progress value={report.riskScore} className="h-3"/>
                </div>
                <div className="space-y-2">
                  <h4 className="font-semibold">Recommendations</h4>
                  <ScrollArea className="h-48 rounded-md border p-4">
                      <p className="text-sm whitespace-pre-wrap">{report.recommendations}</p>
                  </ScrollArea>
                </div>
                <Button onClick={onReset}>Start New Analysis</Button>
            </CardContent>
        </Card>
    );
  }

  return null;
}
