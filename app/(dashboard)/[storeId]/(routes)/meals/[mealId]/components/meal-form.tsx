"use client"

import { Plus } from "lucide-react";
import * as z from "zod"
import axios from "axios"
import { useState } from "react"
import { zodResolver } from "@hookform/resolvers/zod"
import { useFieldArray, useForm } from "react-hook-form"
import { toast } from "react-hot-toast"
import { Trash } from "lucide-react"
import { Category, Color, Cuisine, Kitchen, Meal, Size } from "@prisma/client"
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
import { Separator } from "@/components/ui/separator"
import { Heading } from "@/components/ui/heading"
import { AlertModal } from "@/components/modals/alert-modal"
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
  products: z.object({ weight: z.string() }).array().min(1)
});

type MealFormValues = z.infer<typeof formSchema>

interface MealFormProps {
  initialData: Meal | null;
  categories: Category[];
  colors: Color[];
  sizes: Size[];
  kitchens: Kitchen[];
  cuisines: Cuisine[];
};

export const MealForm: React.FC<MealFormProps> = ({
  initialData,
  categories,
  sizes,
  kitchens,
  cuisines,
  colors,
}) => {
  const productModal = useProductModal();
  const { onOpen } = useOpenProducts()
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const title = initialData ? 'Edit meal' : 'Create meal';
  const description = initialData ? 'Edit a meal.' : 'Add a new meal';
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
  }

  const form = useForm<MealFormValues>({
    resolver: zodResolver(formSchema),
    defaultValues
  });

  // const { fields, append } = useFieldArray({
  //   control: form.control,
  //   name: "products",
  // });

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

  const onDelete = async () => {
    try {
      setLoading(true);
      await axios.delete(`/api/${params.storeId}/products/${params.productId}`);
      router.refresh();
      router.push(`/${params.storeId}/products`);
      toast.success('Product deleted.');
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
      setOpen(false);
    }
  }

  // const onSelect = (values: any) => {
  //   setProducts(values)
  // }

  return (
    <>
      <AlertModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <div className="flex items-center justify-between">
        <Heading title={title} description={description} />
        <Button onClick={onOpen}>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
        {/* <DialogProducts products={products} /> */}
        {/* <ProductsDialog onSelect={onSelect} /> */}
        {initialData && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </div>
      <Separator />
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
          {/* <ProductTable 
            data={products} 
            loading={loading} 
            form={form} 
          /> */}
          {/* <Table>
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
                    {product.cuisine}

                    <div className="md:grid md:grid-cols-3 gap-8">
                      <FormField
                        control={form.control}
                        name={`weight.[${key}]`}
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Name</FormLabel>
                            <FormControl>
                              <Input disabled={loading} placeholder="Product weight" {...field} />
                            </FormControl>
                            <FormMessage />
                          </FormItem>
                        )}
                      />
                    </div>
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
          </Table> */}
          <Button disabled={loading} className="ml-auto" type="submit">
            {action}
          </Button>
        </form>
      </Form>
    </>
  );
};
