"use client"

import { useGetProducts } from "@/features/products/api/use-get-products";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";

import { Loader2 } from "lucide-react";
import { ProductColumn } from "./components/columns";
import { ProductsClient } from "./components/client";

const ProductsPage = () => {
  const productsQuery = useGetProducts()
  
  const formattedProducts: ProductColumn[] = (productsQuery.data ?? []).map((item: any) => ({
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

  if (productsQuery.isLoading) {
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
        <ProductsClient data={formattedProducts} />
      </div>
    </div>
  );
};

export default ProductsPage;
