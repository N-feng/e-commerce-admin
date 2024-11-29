import { z } from "zod";

export const optionalString = z.string().min(1).optional();

export const mealSchema = z.object({
  name: z.string().min(1).optional(),
  // chineseName: z.string().min(1),
  // images: z.object({ url: z.string() }).array().min(1),
  // price: z.coerce.number().min(1),
  // qty: z.coerce.number().min(1),
  // colorId: z.string().min(1),
  // sizeId: z.string().min(1),
  // categoryId: z.string().min(1),
  // kitchenId: z.string().min(1),
  // cuisineId: z.string().min(1),
  // isFeatured: z.boolean().default(false).optional(),
  // isArchived: z.boolean().default(false).optional(),
  // products: z.object({ weight: z.string().min(1) }).array().min(1)
  mealItems: z
    .array(
      z.object({
        weight: optionalString,
        name: optionalString,
        chineseName: optionalString,
        category: optionalString,
        productId: optionalString,
      })
    )
    .optional()
});



export type MealValues = z.infer<typeof mealSchema> & {
  id?: string;
}