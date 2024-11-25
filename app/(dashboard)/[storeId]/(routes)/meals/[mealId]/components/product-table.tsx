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
import { ProductColumn } from "./columns"
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"

type Props = {
  data: ProductColumn[];
  loading: boolean;
  form: any;
}

export function ProductTable({
  data,
  loading,
  form,
}: Props) {
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
        {data.map((product, key) => (
          <TableRow key={product.id}>
            <TableCell className="font-medium">{product.name}</TableCell>
            <TableCell>{product.chineseName}</TableCell>
            <TableCell>{product.category}</TableCell>
            <TableCell className="text-right">
              {/* {product.cuisine} */}

              {/* <div className="md:grid md:grid-cols-3 gap-8"> */}
                <FormField
                  control={form.control}
                  name={`weight.[${key}]`}
                  render={({ field }) => (
                    <FormItem>
                      {/* <FormLabel>Name</FormLabel> */}
                      <FormControl>
                        <Input disabled={loading} placeholder="Product weight" {...field} />
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
  )
}
