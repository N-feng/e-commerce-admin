import { generateSHA1, generateSignature } from "@/lib/utils";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { toast } from "react-hot-toast";

export const useDeleteImage = (publicId: string) => {
  const queryClient = useQueryClient();

  const mutation = useMutation<any, Error>({
    mutationFn: async () => {
      const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
      const timestamp = new Date().getTime();
      const apiKey = process.env.CLOUDINARY_API_KEY!;
      console.log('apiKey: ', apiKey);
      const apiSecret = process.env.CLOUDINARY_API_SECRET!;
      const signature = generateSHA1(generateSignature(publicId, apiSecret));
      const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/destroy`;

      const response = await axios.post(url, {
        public_id: publicId,
        signature: signature,
        api_key: apiKey,
        timestamp: timestamp,
      });
      console.log('response: ', response);
      return response;
    },
    onSuccess: () => {
      toast.success("Image deleted");
      // queryClient.invalidateQueries({ queryKey: ["category", id] });
      // queryClient.invalidateQueries({ queryKey: ["categories"] });
      // queryClient.invalidateQueries({ queryKey: ["transactions"] });
      // queryClient.invalidateQueries({ queryKey: ["summary"] });
    },
    onError: () => {
      toast.error("Failed to delete image");
    },
  });

  return mutation;
};
