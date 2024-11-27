"use client"
import * as z from "zod"
import axios from "axios"
import { useEffect, useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Color, Meal } from "@prisma/client"
import { useParams, useRouter } from "next/navigation"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { MultiUploader } from "@/components/mulit-uploader"
import { useProductModal } from "@/hooks/use-product-modal";
import { useOpenProducts } from "@/features/products/hooks/use-open-products";

const formSchema = z.object({
  name: z.string().min(1),
  chineseName: z.string().min(1),
  images: z.object({ url: z.string() }).array().min(1),
  price: z.coerce.number().min(1),
  qty: z.coerce.number().min(1),
  // colorId: z.string().min(1),
  // sizeId: z.string().min(1),
  categoryId: z.string().min(1),
  kitchenId: z.string().min(1),
  cuisineId: z.string().min(1),
  isFeatured: z.boolean().default(false).optional(),
  isArchived: z.boolean().default(false).optional(),
  products: z.object({ weight: z.string().min(1) }).array().min(1)
});

type MealFormValues = z.infer<typeof formSchema>

interface MealFormProps {
  initialData: Meal | null;
  // categories: Category[];
  colors: Color[];
  // sizes: Size[];
  // kitchens: Kitchen[];
  // cuisines: Cuisine[];
};

type FormValues = {
  products: {
    weight: string;
  }[];
};

export const MealForm: React.FC<MealFormProps> = ({
  initialData,
  // categories,
  // sizes,
  // kitchens,
  // cuisines,
  colors,
}) => {
  const productModal = useProductModal();
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const toastMessage = initialData ? 'Meal updated.' : 'Meal created.';
  const action = initialData ? 'Save changes' : 'Create';

  const defaultValues = initialData ? {
    ...initialData,
  } : {
    name: '',
    chineseName: '',
    images: [],
    price: 1,
    qty: 1,
    categoryId: '',
    colorId: '',
    sizeId: '',
    isFeatured: false,
    isArchived: false,
    products: [
      // { weight: '111' }
    ]
  }

  const form = useForm<MealFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  const { fields, append } = useFieldArray({
    control: form.control,
    name: "products",
  });

  const onSubmit = async (data: MealFormValues) => {
    const values = {
      ...data,
      price: String(data?.price),
      qty: data?.qty,
    }
    try {
      setLoading(true);
      if (initialData) {
        await axios.patch(`/api/${params.storeId}/products/${params.productId}`, values);
      } else {
        await axios.post(`/api/${params.storeId}/products`, values);
      }
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  // const onSelect = (values: any) => {
  //   setProducts(values)
  // }

  return (
    <>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8 w-full">
          {/* <FormField
            control={form.control}
            name="images"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Images</FormLabel>
                <FormControl>
                  <>
                    <MultiUploader 
                      value={field.value.map((image) => image.url)} 
                      disabled={loading} 
                      onChange={(urls) => {
                        field.onChange(urls.map((url) => ({ url })));
                      }}
                      onRemove={(url) => field.onChange([...field.value.filter((current) => current.url !== url)])}
                    />
                  </>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          /> */}
          <div className="md:grid md:grid-cols-3 gap-8">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Name</FormLabel>
                  <FormControl>
                    <Input disabled={loading} placeholder="Product name" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          <Table>
            <TableCaption>A list of your recent invoices.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>ChineseName</TableHead>
                <TableHead>Method</TableHead>
                <TableHead className="text-right">Amount</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((product: any, index) => (
                <TableRow key={product.id}>
                  <TableCell className="font-medium">{product.name}</TableCell>
                  <TableCell>{product.chineseName}</TableCell>
                  <TableCell>{product.category}</TableCell>
                  <TableCell className="text-right">
                    {/* {product.cuisine} */}

                    {/* <div className="md:grid md:grid-cols-3 gap-8"> */}
                      <FormField
                        control={form.control}
                        name={`products.${index}.weight`}
                        render={({ field }) => (
                          <FormItem>
                            {/* <FormLabel>Name</FormLabel> */}
                            <FormControl>
                              <Input disabled={loading} placeholder="Product weight" {...form.register(`products.${index}.weight` as const, {
                                required: true
                              })} className="w-[150px] inline-block text-right" />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    {/* </div> */}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <TableFooter>
              <TableRow>
                <TableCell colSpan={3}>Total</TableCell>
                <TableCell className="text-right">$2,500.00</TableCell>
              </TableRow>
            </TableFooter>
          </Table>
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
