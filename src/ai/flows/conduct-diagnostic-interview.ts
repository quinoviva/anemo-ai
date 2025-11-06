'use server';

/**
 * @fileOverview This file defines a Genkit flow for conducting an interactive diagnostic interview to assess anemia risk.
 *
 * The flow takes user responses and profile data as input, and returns a set of personalized questions
 * to gather additional context about the user's condition.
 *
 * @interface ConductDiagnosticInterviewInput - Input schema for the diagnostic interview flow.
 * @interface ConductDiagnosticInterviewOutput - Output schema for the diagnostic interview flow.
 * @function conductDiagnosticInterview - The main function to start the diagnostic interview flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConductDiagnosticInterviewInputSchema = z.object({
  userId: z.string().describe('The ID of the user.'),
  lastResponse: z.string().optional().describe('The last response from the user.'),
  profileData: z.record(z.any()).optional().describe('User profile data including age, gender etc.'),
  imageAnalysisResult: z.string().optional().describe('The result of the image analysis.'),
});
export type ConductDiagnosticInterviewInput = z.infer<
  typeof ConductDiagnosticInterviewInputSchema
>;

const ConductDiagnosticInterviewOutputSchema = z.object({
  question: z.string().describe('The next question to ask the user.'),
  isComplete: z.boolean().describe('Indicates if the interview is complete.'),
});
export type ConductDiagnosticInterviewOutput = z.infer<
  typeof ConductDiagnosticInterviewOutputSchema
>;

export async function conductDiagnosticInterview(
  input: ConductDiagnosticInterviewInput
): Promise<ConductDiagnosticInterviewOutput> {
  return conductDiagnosticInterviewFlow(input);
}

const diagnosticInterviewPrompt = ai.definePrompt({
  name: 'diagnosticInterviewPrompt',
  input: {schema: ConductDiagnosticInterviewInputSchema},
  output: {schema: ConductDiagnosticInterviewOutputSchema},
  prompt: `You are an AI assistant designed to conduct a diagnostic interview for anemia.

  Your goal is to ask the user questions that will help determine their risk of having anemia.
  Consider any provided profile data, image analysis results and previous responses when formulating your next question.
  The interview should be interactive and feel like a real medical consultation.
  Ask one question at a time and tailor the questions based on the user's responses.

  If the user mentions symptoms like fatigue, dizziness, or shortness of breath, ask follow-up questions
  to gather more details about the symptoms.

  If the user is female, ask about their menstrual history, including the date of their last period, flow intensity, and duration.

  Here is the user's profile data: {{{profileData}}}
  Here is the image analysis result: {{{imageAnalysisResult}}}
  Here is the user's last response: {{{lastResponse}}}

  Ask the next question or indicate if the interview is complete.
  Format your response as a JSON object with "question" and "isComplete" fields.
  `,
});

const conductDiagnosticInterviewFlow = ai.defineFlow(
  {
    name: 'conductDiagnosticInterviewFlow',
    inputSchema: ConductDiagnosticInterviewInputSchema,
    outputSchema: ConductDiagnosticInterviewOutputSchema,
  },
  async input => {
    const {output} = await diagnosticInterviewPrompt(input);
    return output!;
  }
);
