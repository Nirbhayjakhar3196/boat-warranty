import { z } from "zod";

export const productSchema = z.object({
  serialNumber: z.string().min(1, "Serial Number is required"),
  name: z.string().min(2, "Product name is required"),
  model: z.string().min(1, "Model is required"),
  purchaseDate: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
  warrantyExpiry: z.union([z.string(), z.date()]).transform((val) => new Date(val)),
  warrantyPdfUrl: z.union([z.string().url(), z.literal(""), z.null()]).optional(),
});