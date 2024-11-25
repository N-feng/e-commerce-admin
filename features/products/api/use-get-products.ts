import { formatter } from "@/lib/utils";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";
import { format } from "date-fns";

export const useGetAccounts = (storeId?: string) => {
  const query = useQuery({
    enabled: !!storeId,
    queryKey: ["products", storeId],
    queryFn: async () => {
      const response = await axios.get(`/api/${storeId}/products`);
      console.log('response: ', response);
      return response.data.map((item: any) => ({
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
    },
  });

  return query;
};
