'use server';
/**
 * @fileOverview A chatbot AI agent that answers questions about anemia.
 *
 * - answerAnemiaQuestion - A function that answers questions about anemia.
 * - AnswerAnemiaQuestionInput - The input type for the answerAnemiaQuestion function.
 * - AnswerAnemiaQuestionOutput - The return type for the answerAnemiaQuestion function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const AnswerAnemiaQuestionInputSchema = z.object({
  question: z.string().describe('The question about anemia or related health topics.'),
  language: z.string().optional().describe('The language to respond in. Defaults to English.'),
});
export type AnswerAnemiaQuestionInput = z.infer<typeof AnswerAnemiaQuestionInputSchema>;

const AnswerAnemiaQuestionOutputSchema = z.object({
  answer: z.string().describe('The answer to the question about anemia.'),
});
export type AnswerAnemiaQuestionOutput = z.infer<typeof AnswerAnemiaQuestionOutputSchema>;

export async function answerAnemiaQuestion(input: AnswerAnemiaQuestionInput): Promise<AnswerAnemiaQuestionOutput> {
  return answerAnemiaQuestionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'answerAnemiaQuestionPrompt',
  input: {schema: AnswerAnemiaQuestionInputSchema},
  output: {schema: AnswerAnemiaQuestionOutputSchema},
  prompt: `You are a helpful and friendly AI chatbot named ChatbotAI. You specialize in providing information and advice about anemia and related health topics. Your goal is to be supportive and clear.

  Answer the following question clearly and concisely, in the language specified. If no language is specified, answer in English.

  If the user asks who you are, introduce yourself as the ChatbotAI assistant.

  Question: {{{question}}}
  Language: {{{language}}}
`,
});

const answerAnemiaQuestionFlow = ai.defineFlow(
  {
    name: 'answerAnemiaQuestionFlow',
    inputSchema: AnswerAnemiaQuestionInputSchema,
    outputSchema: AnswerAnemiaQuestionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
