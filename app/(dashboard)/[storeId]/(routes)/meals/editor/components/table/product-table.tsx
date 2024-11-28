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
import { ProductColumn } from "../columns"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { useForm, useFieldArray, useWatch, Control } from "react-hook-form";
import { EditorFormProps } from "../types";

type FormValues = {
  cart: {
    name: string;
    price: number;
    quantity: number;
    weight: string;
  }[];
};

export function ProductTable({
  mealData
}: EditorFormProps) {
  const {
    register,
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<FormValues>({
    defaultValues: {
      cart: [{ name: "test", quantity: 1, price: 23, weight: '111' }]
    },
    mode: "onBlur"
  });
  const { fields, append, remove } = useFieldArray({
    name: "cart",
    control
  });
  const onSubmit = (data: FormValues) => console.log(data);
  return (
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
        {mealData.products?.map((field: any, index: any) => (
          <TableRow key={field.name}>
            <TableCell className="font-medium">{field.name}</TableCell>
            <TableCell>{field.quantity}</TableCell>
            <TableCell>{field.price}</TableCell>
            <TableCell className="text-right">
              {/* {product.cuisine} */}
              <Input placeholder="Product weight" {...register(`cart.${index}.weight` as const, {
                required: true
              })} className="w-[100px] inline-block text-right" />
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
  )
}
