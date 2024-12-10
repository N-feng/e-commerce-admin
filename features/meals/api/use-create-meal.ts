
import { toast } from "react-hot-toast";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import axios from "axios";
import { useParams } from "next/navigation";
import { MealValues } from "@/app/(dashboard)/[storeId]/(routes)/meals/editor/components/meal-editor";

export const useCreateMeal = () => {
  const queryClient = useQueryClient();
  const params = useParams();
  
  const storeId = params.storeId;

  const mutation = useMutation<any, Error, MealValues>({
    mutationFn: async (json) => {
      console.log('get json when create meal: ', json);
      // const response = await client.api.categories[":id"]["$patch"]({
      //   param: { id },
      //   json,
      // });
      const {data} = await axios.post(`/api/${params.storeId}/meals/`, json);
      console.log('create meal data: ', data);
      return data;
    },
    onSuccess: () => {
      toast.success("Meal updated");
      // queryClient.invalidateQueries({ queryKey: ["category", id] });
      // queryClient.invalidateQueries({ queryKey: ["categories"] });
      // queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to update meal");
    },
  });

  return mutation;
};
