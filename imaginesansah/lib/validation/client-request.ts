import { z } from "zod";

export const clientRequestSchema = z.object({
  full_name: z.string().trim().min(2, "Enter your full name.").max(120),
  whatsapp_number: z
    .string()
    .trim()
    .regex(/^\+?\d{9,15}$/, "Enter a valid WhatsApp number, digits only."),
  email: z.string().trim().email("Enter a valid email.").optional().or(z.literal("")),
  project_type: z.string().trim().min(2, "Select or describe a project type.").max(120),
  service_id: z.string().uuid().optional().nullable(),
  description: z
    .string()
    .trim()
    .min(20, "Tell me a bit more about the project (min 20 characters).")
    .max(4000),
  preferred_deadline: z.string().optional().nullable(),
  budget_range: z.string().trim().max(120).optional().or(z.literal("")),
  reference_notes: z.string().trim().max(2000).optional().or(z.literal("")),
});

export type ClientRequestInput = z.infer<typeof clientRequestSchema>;

// Defense-in-depth on top of the Storage bucket's own mime/size limits.
export const MAX_REFERENCE_FILE_BYTES = 20 * 1024 * 1024; // 20MB
export const ALLOWED_REFERENCE_MIME_TYPES = [
  "image/jpeg",
  "image/png",
  "image/webp",
  "application/pdf",
];
