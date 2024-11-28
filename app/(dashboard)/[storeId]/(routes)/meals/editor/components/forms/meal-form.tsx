"use client"

import { useEffect, useState } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";
import { toast } from "react-hot-toast";
import { useParams, useRouter } from "next/navigation";

import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { MultiUploader } from "@/components/mulit-uploader";
import { useProductModal } from "@/hooks/use-product-modal";
import { mealSchema, MealValues } from "../validation";
import { EditorFormProps } from "../types";

export const MealForm = ({
  mealData,
  setMealData,
}: EditorFormProps) => {
  const productModal = useProductModal();
  const params = useParams();
  const router = useRouter();

  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  const form = useForm<MealValues>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      mealItems: mealData.products || []
    }
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setMealData({
        ...mealData,
        products: values.mealItems?.filter((product) => product !== undefined) || [],
      });
    });
    return unsubscribe;
  }, [form, mealData, setMealData]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "mealItems",
  });

  const onSubmit = async (data: MealValues) => {
    const values = {
      ...data,
      // price: String(data?.price),
      // qty: data?.qty,
    }
    try {
      setLoading(true);
      // if (initialData) {
      //   await axios.patch(`/api/${params.storeId}/products/${params.productId}`, values);
      // } else {
      //   await axios.post(`/api/${params.storeId}/products`, values);
      // }
      router.refresh();
      router.push(`/${params.storeId}/products`);
      // toast.success(toastMessage);
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
              {fields.map((field: any, index) => (
                <ProductItem
                  id={field.id}
                  key={field.key}
                  index={index}
                  form={form}
                  remove={remove}
                  field={field}
                />
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
            {/* {action} */}
            Submit
          </Button>
        </form>
      </Form>
    </>
  );
};

interface ProductItemProps {
  id: string;
  form: UseFormReturn<MealValues>;
  index: number;
  remove: (index: number) => void;
  field: any;
}

function ProductItem({ id, form, index, remove, field }: ProductItemProps) {
  return (

    <div>
      <TableRow>
        <TableCell className="font-medium">{field.name}</TableCell>
        <TableCell>{field.chineseName}</TableCell>
        <TableCell>{field.category}</TableCell>
        <TableCell className="text-right">
          {/* {product.cuisine} */}

          {/* <div className="md:grid md:grid-cols-3 gap-8"> */}
            <FormField
              control={form.control}
              name={`mealItems.${index}.weight`}
              render={({ field }) => (
                <FormItem>
                  {/* <FormLabel>Name</FormLabel> */}
                  <FormControl>
                    {/* <Input placeholder="Product weight" {...form.register(`products.${index}.weight` as const, {
                      required: true
                    })} className="w-[150px] inline-block text-right" /> */}
                    <Input {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          {/* </div> */}
        </TableCell>
      </TableRow>
    </div>
  )
}
