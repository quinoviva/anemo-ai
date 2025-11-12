'use server';

/**
 * @fileOverview A flow to analyze a Complete Blood Count (CBC) lab report image.
 *
 * - analyzeCbcReport - A function that analyzes a CBC report from an image using OCR.
 */

import { ai } from '@/ai/genkit';
import {
  AnalyzeCbcReportInput,
  AnalyzeCbcReportInputSchema,
  AnalyzeCbcReportOutput,
  AnalyzeCbcReportOutputSchema,
} from '@/ai/schemas/cbc-report';
import { z } from 'genkit';

export async function analyzeCbcReport(
  input: AnalyzeCbcReportInput
): Promise<AnalyzeCbcReportOutput> {
  return analyzeCbcReportFlow(input);
}

const CbcAnalysisResultSchema = z.object({
  summary: z
    .string()
    .describe(
      'A simple, one-sentence summary of the overall result (e.g., "Hemoglobin level appears below normal, suggesting possible anemia." or "All CBC values are within normal range."). If the image is not a valid CBC report, the summary MUST state that.'
    ),
  parameters: z
    .array(
      z.object({
        parameter: z.string(),
        value: z.string(),
        unit: z.string(),
        range: z.string(),
        isNormal: z.boolean(),
      })
    )
    .describe(
      'An array of key CBC parameters. If the image is invalid or unreadable, this MUST be an empty array.'
    ),
});


const analyzeCbcReportFlow = ai.defineFlow(
  {
    name: 'analyzeCbcReportFlow',
    inputSchema: AnalyzeCbcReportInputSchema,
    outputSchema: AnalyzeCbcReportOutputSchema,
  },
  async input => {
    const { output } = await ai.generate({
      model: 'googleai/gemini-1.5-pro',
      prompt: `You are an expert at reading Complete Blood Count (CBC) lab reports using Optical Character Recognition (OCR). Your task is to analyze the provided image and extract key information with very high accuracy.

**CRITICAL Instructions:**

1.  **Assess Image Validity:** Your first and most important task is to determine if the image is a valid CBC lab report.
    - If the image is **NOT a CBC report** (e.g., a photo of a cat, a landscape, or a different medical document), you MUST return a summary stating: "The uploaded image does not appear to be a valid CBC lab report." and the parameters array must be empty.
    - If the image **IS a CBC report but is too blurry, dark, or unreadable**, you MUST return a summary stating: "The image is too blurry or unclear to analyze. Please upload a high-quality, well-lit photo of the report." and the parameters array must be empty.

2.  **If the Image is Valid and Readable:**
    - **Scan the Image:** Analyze the image to identify text and values from the CBC report.
    - **Extract Key Parameters:** Focus on extracting the following key parameters. If a parameter is not present, omit it from the results.
        - Hemoglobin (HGB or Hb)
        - Hematocrit (HCT)
        - Red Blood Cell (RBC) count
        - Mean Corpuscular Volume (MCV)
        - Mean Corpuscular Hemoglobin (MCH)
    - **Populate Data:** For each parameter found, extract its value, unit, and reference range. Determine if the value is within the normal range and set 'isNormal' accordingly.
    - **Generate Summary:** Based on your analysis, create a concise, one-sentence summary.
        - If Hemoglobin/Hematocrit are low: "Hemoglobin level appears below normal, suggesting possible anemia."
        - If all key values are normal: "All key CBC values appear to be within the normal range."

Image of the lab report: {{media url=photoDataUri}}`,
      output: {
        schema: CbcAnalysisResultSchema,
      },
      input: input,
    });
    
    // Construct the final, validated output object in code, not in the prompt.
    // This is more reliable.
    const finalOutput: AnalyzeCbcReportOutput = {
        summary: output?.summary || "An unexpected error occurred during analysis.",
        parameters: output?.parameters || [],
    };
    
    return finalOutput;
  }
);
