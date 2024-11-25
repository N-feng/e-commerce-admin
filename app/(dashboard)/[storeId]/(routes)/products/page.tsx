"use client"

import { format } from "date-fns";

import prismadb from "@/lib/prismadb";
import { formatter } from "@/lib/utils";

import { ProductsClient } from "./components/client";
import { ProductColumn } from "./components/columns";
import { useGetAccounts } from "@/features/products/api/use-get-products";

const ProductsPage = ({
  params
}: {
  params: { storeId: string }
}) => {
  // const products = await prismadb.product.findMany({
  //   where: {
  //     storeId: params.storeId
  //   },
  //   include: {
  //     category: true,
  //     // size: true,
  //     // color: true,
  //     kitchen: true,
  //     cuisine: true,
  //   },
  //   orderBy: {
  //     createdAt: 'desc'
  //   }
  // });

  const { data: products } = useGetAccounts(params.storeId)
  

  // const formattedProducts: ProductColumn[] = (products || []).map((item: any) => ({
  //   id: item.id,
  //   name: item.name,
  //   chineseName: item.chineseName,
  //   isFeatured: item.isFeatured,
  //   isArchived: item.isArchived,
  //   price: formatter.format(Number(item.price)),
  //   category: item.category.name,
  //   // size: item.size.name,
  //   // color: item.color.value,
  //   kitchen: item.kitchen.value,
  //   cuisine: item.cuisine.value,
  //   createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  // }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <ProductsClient data={products || []} />
      </div>
    </div>
  );
};

export default ProductsPage;
