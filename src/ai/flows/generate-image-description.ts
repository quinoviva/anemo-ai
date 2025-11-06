'use server';

/**
 * @fileOverview A flow to generate a description of an uploaded image.
 *
 * - generateImageDescription - A function that generates a description of an image.
 * - GenerateImageDescriptionInput - The input type for the generateImageDescription function.
 * - GenerateImageDescriptionOutput - The return type for the generateImageDescription function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateImageDescriptionInputSchema = z.object({
  photoDataUri: z
    .string()
    .describe(
      "A photo of the area to be checked for anemia, as a data URI that must include a MIME type and use Base64 encoding. Expected format: 'data:<mimetype>;base64,<encoded_data>'."
    ),
});
export type GenerateImageDescriptionInput = z.infer<typeof GenerateImageDescriptionInputSchema>;

const GenerateImageDescriptionOutputSchema = z.object({
  description: z.string().describe('A description of the image.'),
  isValid: z.boolean().describe('Whether the image is valid for anemia detection (skin, under-eye, or fingernail).'),
});
export type GenerateImageDescriptionOutput = z.infer<typeof GenerateImageDescriptionOutputSchema>;

export async function generateImageDescription(
  input: GenerateImageDescriptionInput
): Promise<GenerateImageDescriptionOutput> {
  return generateImageDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateImageDescriptionPrompt',
  input: {schema: GenerateImageDescriptionInputSchema},
  output: {schema: GenerateImageDescriptionOutputSchema},
  prompt: `You are an expert medical image analyst.

You will receive a photo, and it is your job to analyze it and determine if it is a valid image for anemia detection. Anemia detection requires an image of skin, under-eye, or fingernails.

Describe the image and determine if it is valid for anemia detection. Set the isValid field to true if it is, and false if it is not.

Image: {{media url=photoDataUri}}`,
});

const generateImageDescriptionFlow = ai.defineFlow(
  {
    name: 'generateImageDescriptionFlow',
    inputSchema: GenerateImageDescriptionInputSchema,
    outputSchema: GenerateImageDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
