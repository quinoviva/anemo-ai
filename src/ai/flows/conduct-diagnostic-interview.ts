'use server';

/**
 * @fileOverview This file defines a Genkit flow for conducting a diagnostic interview to assess anemia risk.
 *
 * The flow now generates a list of questions at once based on initial data,
 * which are then presented to the user as a form.
 *
 * @interface ConductDiagnosticInterviewInput - Input schema for the diagnostic interview flow.
 * @interface ConductDiagnosticInterviewOutput - Output schema for the diagnostic interview flow.
 * @function conductDiagnosticInterview - The main function to start the diagnostic interview flow.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ConductDiagnosticInterviewInputSchema = z.object({
  userId: z.string().describe('The ID of the user.'),
  profileData: z.record(z.any()).optional().describe('User profile data including age, gender etc.'),
  imageAnalysisResult: z.string().optional().describe('The result of the image analysis.'),
});
export type ConductDiagnosticInterviewInput = z.infer<
  typeof ConductDiagnosticInterviewInputSchema
>;

const ConductDiagnosticInterviewOutputSchema = z.object({
  questions: z.array(z.string()).describe('A list of questions to ask the user to build a health profile.'),
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
  prompt: `You are an AI assistant designed to generate a targeted diagnostic questionnaire for anemia risk, mimicking a doctor's intake process.

  Your goal is to generate a list of 5-7 crucial "Yes/No" questions to determine a user's risk of having anemia. The questions must be clinical, clear, and easy to answer.

  Base your questions on the following categories:
  1.  **Common Symptoms:** Ask about fatigue, dizziness, or shortness of breath.
  2.  **Severe Symptoms:** Ask about chest pain or irregular heartbeat, indicating severe anemia.
  3.  **Diet:** Ask about potential Vitamin B12 or folate deficiencies (e.g., vegetarian/vegan diet).
  4.  **Blood Loss:** Ask about signs like black, tarry stools or vomiting blood.
  5.  **Medical History:** Ask about pre-existing conditions like kidney disease or autoimmune disorders.
  6.  **Family History:** Ask if any immediate family members have a history of anemia.
  7.  **Gender-Specific:** If the user is female (check profileData), ALWAYS ask about heavy menstrual bleeding.

  Example Questions:
  - "Have you been feeling unusually tired or weak lately?"
  - "Do you ever experience dizziness or lightheadedness?"
  - "Have you noticed any shortness of breath during routine activities?"
  - "Have you experienced any chest pain or a racing/irregular heartbeat?"
  - "Are you on a strict vegetarian or vegan diet?"

  Here is the user's profile data: {{{profileData}}}
  Here is the image analysis result: {{{imageAnalysisResult}}}

  Generate a list of questions and format your response as a JSON object with a "questions" field containing an array of strings.
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
