import { MealServerData } from "./types";
import { MealValues } from "./validation";

export function mapToResumeValues (data: MealServerData): MealValues {
  return {
    id: data.id,
    name: data.name,
    mealItems: data.mealItems?.map((meal) => ({
      id: meal.id,
      productId: meal.productId,
      mealId: meal.mealId,
      weight: meal.weight,
      name: meal.product.name,
      chineseName: meal.product.chineseName,
      category: meal.product.category.name
    }))
  }
}