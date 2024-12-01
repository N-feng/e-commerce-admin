import { useParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";

export const useGetMeals = () => {
  const params = useParams();
  
  const query = useQuery({
    queryKey: ["meals"],
    queryFn: async () => {
      const response = await axios.get(`/api/${params.storeId}/meals`);
      console.log('get meals: ', response);
      return response.data;
    }
  })

  return query
}