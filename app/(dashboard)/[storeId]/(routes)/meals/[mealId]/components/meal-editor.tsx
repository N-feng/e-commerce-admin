"use client";

import axios from "axios"

import { Plus, Trash } from "lucide-react";

import { Meal, Color, Cuisine, Category, Size, Kitchen, Product } from "@prisma/client";

import { useParams, useRouter } from "next/navigation";
import { useState } from "react";
import { toast } from "react-hot-toast";

import { Heading } from "@/components/ui/heading";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { AlertModal } from "@/components/modals/alert-modal";
import { MealForm } from "./forms/meal-form";
import { NewProductsSheet } from "./new-products-sheet";
import { ProductColumn } from "./table/columns";
import { ProductTable } from "./table/product-table";

interface MealEditorProps {
  initialData: Meal | null;
  categories: Category[];
  colors: Color[];
  sizes: Size[];
  kitchens: Kitchen[];
  cuisines: Cuisine[];
  products: ProductColumn[]; 
};

function mapToResumeValues (data: Meal) {
  return {
    ...data
  }
}

const MealEditor = ({
  initialData,
  categories,
  sizes,
  kitchens,
  cuisines,
  colors,
  products,
}: MealEditorProps) => {
  const params = useParams();
  const router = useRouter();

  const [mealData, setMealData] = useState(
    initialData ? mapToResumeValues(initialData) : {}
  )
  
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const title = initialData ? 'Edit meal' : 'Create meal';
  const description = initialData ? 'Edit a meal.' : 'Add a new meal';

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success('Product deleted.');
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  return (
    <div>
      <AlertModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <header className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {/* <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button> */}
        {/* <DialogProducts products={products} /> */}
        {/* <ProductsDialog onSelect={onSelect} /> */}
        <NewProductsSheet 
          products={products} 
          mealData={mealData}
          setMealData={setMealData} 
        />
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </header>
      <Separator />
      <MealForm
          // categories={categories} 
          colors={colors}
          // sizes={sizes}
          // kitchens={kitchens}
          // cuisines={cuisines}
          initialData={initialData} />

      <ProductTable
        mealData={mealData}
        setMealData={setMealData}  
      />
    </div>
  )
}

export default MealEditor