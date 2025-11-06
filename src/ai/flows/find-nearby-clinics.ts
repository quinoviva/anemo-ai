'use server';
/**
 * @fileOverview An AI flow to find nearby clinics and hospitals using a dynamic search tool.
 *
 * - findNearbyClinics - A function that returns a list of healthcare providers based on a search query.
 * - FindNearbyClinicsInput - The input type for the findNearbyClinics function.
 * - FindNearbyClinicsOutput - The return type for the findNearbyClinics function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const ClinicSchema = z.object({
  name: z.string().describe('The name of the hospital, clinic, or doctor.'),
  address: z.string().describe('The address of the location.'),
  type: z.enum(['Hospital', 'Doctor', 'Clinic']).describe('The type of healthcare provider.'),
  contact: z.string().optional().describe('Contact number of the provider.'),
  hours: z.string().optional().describe('Operating hours.'),
  website: z.string().optional().describe('The official website.'),
  notes: z.string().optional().describe('Additional notes or specialties.'),
});

const FindNearbyClinicsInputSchema = z.object({
  query: z.string().describe("The user's search query for a location or address, e.g., 'hospitals in Iloilo City' or 'clinics near Molo'"),
});
export type FindNearbyClinicsInput = z.infer<typeof FindNearbyClinicsInputSchema>;

const FindNearbyClinicsOutputSchema = z.object({
  results: z.array(ClinicSchema).describe('A list of relevant clinics, hospitals, or doctors found via search.'),
});
export type FindNearbyClinicsOutput = z.infer<typeof FindNearbyClinicsOutputSchema>;

// This is a mock tool. In a real application, this would use a real search API.
// For this context, we will simulate the search by providing a few results
// to demonstrate the tool-use functionality.
const searchForHealthcareProviders = ai.defineTool(
  {
    name: 'searchForHealthcareProviders',
    description: 'Searches for real-world healthcare providers (hospitals, clinics, doctors) based on a location query. Provides up-to-date details.',
    inputSchema: FindNearbyClinicsInputSchema,
    outputSchema: FindNearbyClinicsOutputSchema,
  },
  async ({query}) => {
    // In a real implementation, this would call a Google Maps/Places API
    // or a similar service. For now, we return a small, static list to
    // simulate a successful API call.
    console.log(`Simulating search for: ${query}`);
     const simulatedResults = [
        { name: 'Iloilo Doctors’ Hospital', type: 'Hospital', address: 'West Timawa Avenue, Molo, Iloilo City', contact: '(033) 337-8621', hours: '24/7', website: 'https://www.iloilodoctorshospital.com.ph/', notes: 'Leading private hospital in the region.' },
        { name: 'The Medical City Iloilo', type: 'Hospital', address: 'Lopez Jaena St, Molo, Iloilo City', contact: '(033) 500-1000', hours: '24/7', website: 'https://themedicalcity.com/iloilo', notes: 'Tertiary care hospital with comprehensive services.' },
        { name: 'QualiMed Hospital Iloilo', type: 'Hospital', address: 'Donato Pison Ave, Mandurriao, Iloilo City', contact: '(033) 500-9254', hours: '24/7', website: 'https://qualimed.com.ph/iloilo/', notes: 'Part of the Ayala Land and Mercado General Hospital network.' },
        { name: 'Western Visayas Medical Center', type: 'Hospital', address: 'Q. Abeto St, Mandurriao, Iloilo City', contact: '(033) 321-2841', hours: '24/7', website: 'https://wvmc.doh.gov.ph/', notes: 'A DOH-retained tertiary teaching and training hospital.' },
    ];
    return { results: simulatedResults.filter(r => r.address.toLowerCase().includes(query.toLowerCase()) || r.name.toLowerCase().includes(query.toLowerCase())) };
  }
);


export async function findNearbyClinics(
  input: FindNearbyClinicsInput
): Promise<FindNearbyClinicsOutput> {
  return findNearbyClinicsFlow(input);
}


const findNearbyClinicsFlow = ai.defineFlow(
  {
    name: 'findNearbyClinicsFlow',
    inputSchema: FindNearbyClinicsInputSchema,
    outputSchema: FindNearbyClinicsOutputSchema,
  },
  async (input) => {
    const llmResponse = await ai.generate({
      prompt: `You are an expert local guide for Iloilo City and Province, Philippines. Your goal is to help users find the nearest and most relevant medical facilities.

      Use the 'searchForHealthcareProviders' tool to find real-time information based on the user's query.

      User query: "${input.query}"

      Analyze the user's query and use the search tool to get a list of providers. Then, return the results from the tool directly. Do not make up information.
      `,
      model: 'googleai/gemini-2.5-flash',
      tools: [searchForHealthcareProviders],
      output: {
        schema: FindNearbyClinicsOutputSchema,
      },
    });

    const toolResponse = llmResponse.toolRequests;

    if (toolResponse.length > 0 && toolResponse[0].name === 'searchForHealthcareProviders') {
        const searchResult = await searchForHealthcareProviders(toolResponse[0].input);
        return searchResult;
    }
    
    // If the model decides not to use the tool, or provides a direct answer.
    if(llmResponse.output) {
      return llmResponse.output;
    }

    // Fallback for when no tool is called and no direct output is given.
    return { results: [] };
  }
);
