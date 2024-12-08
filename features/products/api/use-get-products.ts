import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";

export const useGetProducts = () => {
  const params = useParams();
  
  const storeId = params.storeId;

  const query = useQuery({
    queryKey: ["products", { storeId }],
    queryFn: async () => {
      const {data} = await axios.get(`/api/${storeId}/products`);
      console.log('get products data: ', data);
      return data;
    },
  });

  return query;
};
