"use client";

import { Plus } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/ui/data-table";
import { Heading } from "@/components/ui/heading";
import { Separator } from "@/components/ui/separator";
import { ApiList } from "@/components/ui/api-list";

import { MealColumn, columns } from "./columns";

interface MealsClientProps {
  data: MealColumn[];
};

export const MealsClient: React.FC<MealsClientProps> = ({
  data
}) => {
  const params = useParams();
  const router = useRouter();

  return (
    <> 
      <div className="flex items-center justify-between">
        <Heading title={`Meals (${data.length})`} description="Manage meals for your store" />
        <Button onClick={() => router.push(`/${params.storeId}/meals/editor`)}>
          <Plus className="mr-2 h-4 w-4" /> Add New
        </Button>
      </div>
      <Separator />
      <DataTable searchKey="name" columns={columns} data={data} />
      <Heading title="API" description="API Calls for Meals" />
      <Separator />
      <ApiList entityName="meals" entityIdName="mealId" />
    </>
  );
};
