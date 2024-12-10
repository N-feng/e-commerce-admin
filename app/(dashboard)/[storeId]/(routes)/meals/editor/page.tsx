"use client";

import { useGetMeal } from "@/features/meals/api/use-get-meal";
import { Loader2 } from "lucide-react";
import MealEditor from "./components/meal-editor";
interface PageProps {
  params: { mealId: string, storeId: string };
  searchParams: Promise<{ mealId?: string }>;
}

const MealPage = ({ params }: PageProps) => {
  // const { mealId } = await searchParams;

  const mealQuery = useGetMeal();
  const defaultValues = mealQuery.data
    ? mealQuery.data
    : null

  const isLoading = mealQuery.isLoading;

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        {isLoading ? (
          <div className="absolute inset-0 flex items-center justify-center">
            <Loader2 className="size-4 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <MealEditor 
            mealToEdit={defaultValues}
          />
        )}
      </div>
    </div>
  );
}

export default MealPage;
