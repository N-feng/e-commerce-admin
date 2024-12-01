"use client"

import * as React from "react"
import { Loader2, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { useGetProducts } from "../api/use-get-products";
import { formatter } from "@/lib/utils";
import { format } from "date-fns";
import { ProductsTable } from "./products-table/client";
import { ProductColumn } from "./products-table/columns";

export const NewProductsSheet = ({
  selectIds,
  setProducts
}: {
  selectIds: string[],
  setProducts: (addSelected: ProductColumn[]) => void
}) => {
  const [open, setOpen] = React.useState(false);

  const productsQuery = useGetProducts();
  const productOptions = (productsQuery.data ?? []).map((item: any) => ({
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

  const onAdd = ((addSelected: ProductColumn[]) => {
    setProducts(addSelected);
    setOpen(false);
  })

  if (productsQuery.isLoading) {
    return (
      <div className="w-full h-[500px] flex items-center justify-center">
        <Loader2 className="animate-spin size-6 text-slate-300" />
      </div>
    );
  }

  return (
    <Sheet open={open} onOpenChange={setOpen}>
      <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </SheetTrigger>
      <SheetContent side={"top"} className="space-y-4">
        <SheetHeader>
          <SheetTitle>Select Products</SheetTitle>
          <SheetDescription>
            Create a new category to organize your transactions
          </SheetDescription>
        </SheetHeader>

        <ProductsTable 
          products={productOptions}
          selectIds={selectIds}
          onAdd={onAdd}
        />
      </SheetContent>
    </Sheet>
  );
};
