import prismadb from "@/lib/prismadb";

import { KitchenForm } from "./components/kitchen-form";

const KitchenPage = async ({
  params
}: {
  params: { 
    kitchenId: string;
    storeId: string;
  }
}) => {
  const kitchen = params.kitchenId.length === 3 ? null : await prismadb.kitchen.findUnique({
    where: {
      storeId: params.storeId,
      id: params.kitchenId,
    }
  });

  return ( 
    <div className="flex-col">
      <div className="flex-1 space-y-4 p-8 pt-6">
        <KitchenForm initialData={kitchen} />
      </div>
    </div>
  );
}

export default KitchenPage;
