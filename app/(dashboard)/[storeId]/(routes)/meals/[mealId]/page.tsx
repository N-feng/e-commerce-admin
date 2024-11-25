import prismadb from "@/lib/prismadb";

import { MealForm } from "./components/meal-form";

const MealPage = async ({
  params
}: {
  params: { mealId: string, storeId: string }
}) => {
  const meal = params.mealId === 'new' ? null : await prismadb.meal.findUnique({
    where: {
      id: params.mealId,
    },
    include: {
      // images: true,
      // attribute: true,
      // vitamins: true,
      // minerals: true,
    }
  });

  const categories = await prismadb.category.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const sizes = await prismadb.size.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const kitchens = await prismadb.kitchen.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const cuisines = await prismadb.cuisine.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  const colors = await prismadb.color.findMany({
    where: {
      storeId: params.storeId,
    },
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <MealForm 
          categories={categories} 
          colors={colors}
          sizes={sizes}
          kitchens={kitchens}
          cuisines={cuisines}
          initialData={meal}
        />
      </div>
    </div>
  );
}

export default MealPage;
