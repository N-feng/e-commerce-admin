import { Prisma } from "@prisma/client";

export interface EditorFormProps {
  mealData: any;
  setMealData: (data: any) => void;
}

export const resumeDataInclude = {
  mealItems: true,
} satisfies Prisma.MealInclude;

export type MealServerData = Prisma.MealGetPayload<{
  include: typeof resumeDataInclude;
}>;

