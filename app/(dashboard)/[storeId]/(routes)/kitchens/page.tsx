import { format } from "date-fns";

import prismadb from "@/lib/prismadb";

import { KitchenColumn } from "./components/columns"
import { KitchenClient } from "./components/client";

const KitchenPage = async ({
  params
}: {
  params: { storeId: string }
}) => {
  const kitchens = await prismadb.kitchen.findMany({
    where: {
      storeId: params.storeId
    },
    orderBy: {
      createdAt: 'desc'
    }
  });

  const formattedKitchens: KitchenColumn[] = kitchens.map((item) => ({
    id: item.id,
    name: item.name,
    value: item.value,
    createdAt: format(item.createdAt, 'MMMM do, yyyy'),
  }));

  return (
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <KitchenClient data={formattedKitchens} />
      </div>
    </div>
  );
};

export default KitchenPage;
