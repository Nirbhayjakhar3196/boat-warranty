import { z } from "zod";

export const productSchema = z.object({
  serialNumber: z.string().min(1, "Serial Number is required"),
  name: z.string().min(2, "Product name is required"),
  model: z.string().min(1, "Model is required"),
  purchaseDate: z.string().datetime(),
  warrantyExpiry: z.string().datetime(),
  warrantyPdfUrl: z.string().url().optional(),
}); 