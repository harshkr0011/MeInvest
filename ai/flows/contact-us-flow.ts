
'use server';
/**
 * @fileOverview An AI flow for processing contact form submissions.
 *
 * - contactUsFlow - A function that handles the contact form submission process.
 * - ContactUsInput - The input type for the contactUsFlow function.
 * - ContactUsOutput - The return type for the contactUsFlow function.
 */

import {ai} from '@/ai/genkit';
import { ContactUsInputSchema, ContactUsOutputSchema, type ContactUsInput, type ContactUsOutput } from '@/types/contact-us';


export async function contactUsFlow(input: ContactUsInput): Promise<ContactUsOutput> {
    return contactUsFlowInternal(input);
}

const contactUsPrompt = ai.definePrompt({
    name: 'contactUsPrompt',
    input: { schema: ContactUsInputSchema },
    output: { schema: ContactUsOutputSchema },
    prompt: `You are an AI assistant for a financial investment platform. Your task is to analyze an incoming user inquiry from a contact form and categorize it.

    Analyze the provided message details:
    - From: {{{name}}} <{{{email}}}>
    - Subject: {{{subject}}}
    - Message: {{{message}}}

    Based on the subject and message, determine the most appropriate category for this inquiry. Categories can include, but are not limited to: "Billing & Subscriptions", "Technical Support", "Account Management", "Investment Advice Request", or "General Feedback".

    Also, assign a priority level:
    - "High": for urgent issues like account lockouts, failed transactions, or security concerns.
    - "Medium": for service-related questions, and non-urgent issues.
    - "Low": for general feedback, suggestions, or non-critical inquiries.

    Provide the output in the requested JSON format.
    `,
});


const contactUsFlowInternal = ai.defineFlow(
  {
    name: 'contactUsFlow',
    inputSchema: ContactUsInputSchema,
    outputSchema: ContactUsOutputSchema,
  },
  async (input) => {
    const { output } = await contactUsPrompt(input);
    if (!output) {
      throw new Error('Failed to get a response from the AI model.');
    }
    return output;
  }
);
