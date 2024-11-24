import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Product } from "@prisma/client"
import { Plus } from "lucide-react"
import { DataTableProducts } from "./data-table-products"
import { ProductColumn } from "./columns"

interface DialogProductsProps {
  products: ProductColumn[]
}

export const DialogProducts: React.FC<DialogProductsProps> = ({
  products
}) => {
  console.log('products: ', products);
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px] min-w-[80%]">
        <DialogHeader>
          <DialogTitle>Select products</DialogTitle>
          <DialogDescription>
            Make changes to your products here. Click save when you&apos;re done.
          </DialogDescription>
        </DialogHeader>
        <DataTableProducts data={products} />
        <DialogFooter>
          <Button type="submit">Save changes</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
