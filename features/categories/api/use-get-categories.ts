import { useQuery } from "@tanstack/react-query";
import { useParams } from "next/navigation";

import axios from "axios";

export const useGetCategories = () => {
  const params = useParams();
  
  const query = useQuery({
    queryKey: ["categories"],
    queryFn: async () => {
      const response = await axios.get(`/api/${params.storeId}/categories`);
      console.log('get categories: ', response);
      return response.data;
    },
  });

  return query;
};
