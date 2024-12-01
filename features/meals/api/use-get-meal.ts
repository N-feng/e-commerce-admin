import { useParams, useSearchParams } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

import axios from "axios";

export const useGetMeal = () => {
  const params = useParams();
  const searchParams = useSearchParams();
  const mealId = searchParams.get("mealId") || "";
  
  const query = useQuery({
    enabled: !!mealId,
    queryKey: ["meal", mealId],
    queryFn: async () => {
      const response = await axios.get(`/api/${params.storeId}/meals/${mealId}`);
      console.log('get meal: ', response);
      return response.data;
    }
  })

  return query
}