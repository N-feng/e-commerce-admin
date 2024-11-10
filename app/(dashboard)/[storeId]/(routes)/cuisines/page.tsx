import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { CuisineColumn } from "./components/columns"
import { CuisineClient } from "./components/client";

const CuisinePage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const cuisines = await prismadb.cuisine.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedCuisines: CuisineColumn[] = cuisines.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <CuisineClient data={formattedCuisines} />
      </div>
    </div>
  );
};

export default CuisinePage;
