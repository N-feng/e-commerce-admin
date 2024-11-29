import prismadb from "@/lib/prismadb";

import MealEditor from "./components/meal-editor";
import { ProductColumn } from "./components/columns";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";
interface PageProps {
  params: { mealId: string, storeId: string };
  searchParams: Promise<{ mealId?: string }>;
}

const MealPage = async ({ params, searchParams }: PageProps) => {
  const { mealId } = await searchParams;
  
  const mealToEdit = mealId ? await prismadb.meal.findUnique({
    where: {
      id: mealId,
    },
    include: {
      // images: true,
      // attribute: true,
      // vitamins: true,
      // minerals: true,
      mealItems: {
        include: {
          product: {
            include: {
              category: true,
            }
          }
        }
      },
    }
  }) : null;

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

  const products = await prismadb.product.findMany({
    where: {
      storeId: params.storeId
    },
    include: {
      category: true,
      // size: true,
      // color: true,
      kitchen: true,
      cuisine: true,
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedProducts: ProductColumn[] = (products || []).map((item: any) => ({
    id: item.id,
    name: item.name,
    chineseName: item.chineseName,
    isFeatured: item.isFeatured,
    isArchived: item.isArchived,
    price: formatter.format(Number(item.price)),
    category: item.category.name,
    // size: item.size.name,
    // color: item.color.value,
    kitchen: item.kitchen.value,
    cuisine: item.cuisine.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <MealEditor 
          categories={categories} 
          colors={colors}
          sizes={sizes}
          kitchens={kitchens}
          cuisines={cuisines}
          products={formattedProducts}
          mealToEdit={mealToEdit}
        />
      </div>
    </div>
  );
}

export default MealPage;
