import {z} from 'zod';

export const repairSchema = z.object({

    productId: z.number().int().positive(),

    issue: z
        .string()
        .min(5, "Atleast 5 characters are needed"),

    description: z
        .string()
        .optional(),

    remarks:z
        .string()
        .optional()

})