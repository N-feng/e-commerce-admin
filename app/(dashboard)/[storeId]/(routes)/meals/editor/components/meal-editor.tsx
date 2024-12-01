"use client";

import axios from "axios"
import { Plus, Trash } from "lucide-react";
import { Meal, Color, Cuisine, Category, Size, Kitchen, Product } from "@prisma/client";

import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "react-hot-toast";
import { useFieldArray, useForm, UseFormReturn } from "react-hook-form";

import { Heading } from "@/components/ui/heading";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
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
import { AlertModal } from "@/components/modals/alert-modal";
import { MultiUploader } from "@/components/mulit-uploader";

import { NewProductsSheet } from "@/features/products/components/new-products-sheet";
import { mealSchema, MealValues } from "./validation";
import { zodResolver } from "@hookform/resolvers/zod";
import { MealServerData } from "./types";
import { mapToResumeValues } from "./utils";
import { CellAction } from "./cell-action";
import { ProductColumn } from "./columns";

interface MealEditorProps {
  mealToEdit: MealServerData | null;
};

const MealEditor = ({
  mealToEdit
}: MealEditorProps) => {
  const params = useParams();
  const router = useRouter();

  const [mealData, setMealData] = useState<MealValues>(
    mealToEdit ? mapToResumeValues(mealToEdit) : {}
  )
  
  const [open, setOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const title = mealToEdit ? 'Edit meal' : 'Create meal';
  const description = mealToEdit ? 'Edit a meal.' : 'Add a new meal';
  const toastMessage = mealToEdit ? 'Meal updated.' : 'Meal created.';
  const action = mealToEdit ? 'Save changes' : 'Create';

  const form = useForm<MealValues>({
    resolver: zodResolver(mealSchema),
    defaultValues: {
      name: mealData.name || '',
      mealItems: mealData.mealItems || []
    }
  });

  useEffect(() => {
    const { unsubscribe } = form.watch(async (values) => {
      const isValid = await form.trigger();
      if (!isValid) return;
      setMealData({
        ...mealData,
        mealItems: values.mealItems?.filter((product) => product !== undefined) || [],
      });
    });
    return unsubscribe;
  }, [form, mealData, setMealData]);

  const { fields, append, remove } = useFieldArray({
    control: form.control,
    name: "mealItems",
  });

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

  const setProducts = (values: ProductColumn[]) => {
    append(values.map((item) => {
      return {
        // ...item,
        productId: item.id,
        name: item.name,
        chineseName: item.chineseName,
        category: item.category,
        weight: ''
      }
    }));
  }

  const onSubmit = async (data: MealValues) => {
    const values = {
      ...data,
      // price: String(data?.price),
      // qty: data?.qty,
    }
    try {
      setLoading(true);
      if (mealToEdit) {
        await axios.patch(`/api/${params.storeId}/meals/${mealToEdit.id}`, values);
      } else {
        await axios.post(`/api/${params.storeId}/meals`, mealData);
      }
      router.refresh();
      router.push(`/${params.storeId}/meals`);
      toast.success(toastMessage);
    } catch (error: any) {
      toast.error('Something went wrong.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <AlertModal 
        isOpen={open} 
        onClose={() => setOpen(false)}
        onConfirm={onDelete}
        loading={loading}
      />
      <header className="flex items-center justify-between">
        <Heading title={title} description={description} />
        {mealToEdit && (
          <Button
            disabled={loading}
            variant="destructive"
            size="sm"
            onClick={() => setOpen(true)}
          >
            <Trash className="h-4 w-4" />
          </Button>
        )}
      </header>
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
          <Table>
            <TableCaption>A list of your recent products.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Name</TableHead>
                <TableHead>ChineseName</TableHead>
                <TableHead>Category</TableHead>
                <TableHead className="text-right">Weight(g)</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {fields.map((field: any, index) => (
                <ProductItem
                  id={field.id}
                  key={field.id}
                  index={index}
                  form={form}
                  remove={remove}
                  field={field}
                />
              ))}
            </TableBody>
          </Table>
          <div className="flex items-center justify-between">
            <Button disabled={loading} className="ml-auto1" type="submit">
              {action}
            </Button>
            <NewProductsSheet 
              selectIds={(mealData.mealItems || []).map(item => item.productId || "")}
              setProducts={setProducts}
            />
          </div>
        </form>
      </Form>
    </>
  )
}

interface ProductItemProps {
  id: string;
  form: UseFormReturn<MealValues>;
  index: number;
  remove: (index: number) => void;
  field: any;
}

function ProductItem({ id, form, index, remove, field }: ProductItemProps) {
  return (
    <TableRow>
      <TableCell className="font-medium">{field.name}</TableCell>
      <TableCell>{field.chineseName}</TableCell>
      <TableCell>{field.category}</TableCell>
      <TableCell className="text-right">
        <FormField
          control={form.control}
          name={`mealItems.${index}.weight`}
          render={({ field }) => (
            <FormItem>
              <FormControl>
                {/* <Input placeholder="Product weight" {...form.register(`products.${index}.weight` as const, {
                  required: true
                })} {...field} className="w-[150px] inline-block text-right" /> */}
                <Input {...field} className="w-[150px] inline-block text-right" />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </TableCell>
      <TableCell className="text-right">
        <CellAction 
          data={field} 
          handleDel={(id) => remove(index)}
        />
      </TableCell>
    </TableRow>
  )
}

export default MealEditor