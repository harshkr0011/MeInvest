
import { z } from 'zod';

export const ContactUsInputSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters."),
  email: z.string().email("Please enter a valid email."),
  subject: z.string().min(5, "Subject must be at least 5 characters."),
  message: z.string().min(10, "Message must be at least 10 characters.").max(500, "Message cannot exceed 500 characters."),
});
export type ContactUsInput = z.infer<typeof ContactUsInputSchema>;
export type ContactFormValues = z.infer<typeof ContactUsInputSchema>;

export const ContactUsOutputSchema = z.object({
  category: z.string().describe('The determined category of the inquiry (e.g., Billing, Technical Support, General Feedback).'),
  priority: z.enum(['Low', 'Medium', 'High']).describe('The assigned priority level.'),
});
export type ContactUsOutput = z.infer<typeof ContactUsOutputSchema>;
