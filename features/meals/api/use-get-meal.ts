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
      return response.data;
    }
  })

  return query
}