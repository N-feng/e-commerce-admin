import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { MealsClient } from "./components/client";
import { MealColumn } from "./components/columns";

const MealsPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const meals = await prismadb.meal.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      // category: true,
      // size: true,
      // color: true,
      // kitchen: true,
      // cuisine: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedMeals: MealColumn[] = meals.map((item) => ({
    id: item.id,
    name: item.name,
    // chineseName: item.chineseName,
    // isFeatured: item.isFeatured,
    // isArchived: item.isArchived,
    // price: formatter.format(Number(item.price)),
    // category: item.category.name,
    // size: item.size.name,
    // color: item.color.value,
    // kitchen: item.kitchen.value,
    // cuisine: item.cuisine.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <MealsClient data={formattedMeals} />
      </div>
    </div>
  );
};

export default MealsPage;
