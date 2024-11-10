import prismadb from "@/lib/prismadb";

import { CuisineForm } from "./components/cuisine-form";

const CuisinePage = async ({
  params
}: {
  params: { 
    cuisineId: string;
    storeId: string;
  }
}) => {
  const cuisine = params.cuisineId.length === 3 ? null : await prismadb.cuisine.findUnique({
    where: {
      storeId: params.storeId,
      id: params.cuisineId,
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CuisineForm initialData={cuisine} />
      </div>
    </div>
  );
}

export default CuisinePage;
