"use client";

import { format } from "date-fns";

import { CategoryColumn } from "./components/columns"
import { CategoriesClient } from "./components/client";
import { useGetCategories } from "@/features/categories/api/use-get-categories";

import { Loader2 } from "lucide-react";

const CategoriesPage = () => {
  const categoriesQuery = useGetCategories();

  if (categoriesQuery.isLoading) {
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

  const formattedCategories: CategoryColumn[] = (categoriesQuery.data ?? []).map((item: CategoryColumn) => ({
    id: item.id,
    name: item.name,
    // billboardLabel: item.billboard.label,
    imageUrl: item.imageUrl,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CategoriesClient data={formattedCategories} />
      </div>
    </div>
  );
};

export default CategoriesPage;
