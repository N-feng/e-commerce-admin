"use client";

import { useGetMeals } from "@/features/meals/api/use-get-meals";
import { Meal } from "@prisma/client";
import { format } from "date-fns";

import { Loader2 } from "lucide-react";
import { MealColumn } from "./components/columns";
import { MealsClient } from "./components/client";

const MealsPage = () => {
  const mealsQuery = useGetMeals();

  const formattedMeals: MealColumn[] = (mealsQuery.data ?? []).map((item: Meal) => ({
    id: item.id,
    name: item.name,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  if (mealsQuery.isLoading) {
    return (
      <div className="flex-col">
        <div className="flex-1 space-y-4 p-8 pt-6">
          <div className="w-full h-[500px] flex items-center justify-center">
            <Loader2 className="animate-spin size-6 text-slate-300" />
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <MealsClient data={formattedMeals} />
      </div>
    </div>
  );
};

export default MealsPage;
