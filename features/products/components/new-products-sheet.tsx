"use client"

import { z } from "zod";

// import { insertCategorySchema } from "@/db/schema";

// import { UseNewCategory } from "@/features/categories/hooks/use-new-category";
// import { useCreateCategory } from "@/features/categories/api/use-create-category";

import * as React from "react"
import {
  ColumnDef,
  ColumnFiltersState,
  SortingState,
  VisibilityState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, MoreHorizontal, Plus } from "lucide-react"

import { Button } from "@/components/ui/button"
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Input } from "@/components/ui/input"
import { useGetAccounts } from "../api/use-get-products";
import { useParams } from "next/navigation";

import { ProductColumn, columnDefaultVisibility, columns } from "./columns";
import { useOpenProducts } from "../hooks/use-open-products";
// import { CategoryForm } from "@/features/categories/components/category-form";

// const formSchema = insertCategorySchema.pick({ name: true });

// type FormValues = z.input<typeof formSchema>;

export const NewProductsSheet = () => {
  const { isOpen, onClose } = useOpenProducts();

  // const mutation = useCreateCategory();
  const [sorting, setSorting] = React.useState<SortingState>([])
  const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>(
    []
  )
  const [columnVisibility, setColumnVisibility] =
    React.useState<VisibilityState>(columnDefaultVisibility)
  const [rowSelection, setRowSelection] = React.useState({})
  const params = useParams();
  console.log('params: ', params);
  const { data: products } = useGetAccounts(params.storeId as string)

  const table = useReactTable({
    data: products || [],
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onColumnVisibilityChange: setColumnVisibility,
    onRowSelectionChange: setRowSelection,
    state: {
      sorting,
      columnFilters,
      columnVisibility,
      rowSelection,
    },
  })

  const onSubmit = (values: any) => {

    const productsSelected = table.getFilteredSelectedRowModel().rows.map((item) => item.original)
    console.log('productsSelected: ', productsSelected);
    if (!productsSelected.length) {
      return;
    }
      // onAdd(productsSelected);
    // mutation.mutate(values, {
    //   onSuccess: () => {
      onClose();
    //   },
    // });
  };

  return (
    <Sheet open={isOpen} onOpenChange={onClose}>
      {/* <SheetTrigger asChild>
        <Button>
          <Plus className="mr-2 h-4 w-4" /> Add Product
        </Button>
      </SheetTrigger> */}
      <SheetContent side={"top"} className="space-y-4">
        <SheetHeader>
          <SheetTitle>Select Products</SheetTitle>
          <SheetDescription>
            Create a new category to organize your transactions
          </SheetDescription>
        </SheetHeader>

        <div className="w-full">
          <div className="flex items-center py-4">
            <Input
              placeholder="Filter names..."
              value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
              onChange={(event) =>
                table.getColumn("name")?.setFilterValue(event.target.value)
              }
              className="max-w-sm"
            />
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="ml-auto">
                  Columns <ChevronDown />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                {table
                  .getAllColumns()
                  .filter((column) => column.getCanHide())
                  .map((column) => {
                    return (
                      <DropdownMenuCheckboxItem
                        key={column.id}
                        className="capitalize"
                        checked={column.getIsVisible()}
                        onCheckedChange={(value) =>
                          column.toggleVisibility(!!value)
                        }
                      >
                        {column.id}
                      </DropdownMenuCheckboxItem>
                    )
                  })}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          <div className="rounded-md border">
            <Table>
              <TableHeader>
                {table.getHeaderGroups().map((headerGroup) => (
                  <TableRow key={headerGroup.id}>
                    {headerGroup.headers.map((header) => {
                      return (
                        <TableHead key={header.id}>
                          {header.isPlaceholder
                            ? null
                            : flexRender(
                                header.column.columnDef.header,
                                header.getContext()
                              )}
                        </TableHead>
                      )
                    })}
                  </TableRow>
                ))}
              </TableHeader>
              <TableBody>
                {table.getRowModel().rows?.length ? (
                  table.getRowModel().rows.map((row) => (
                    <TableRow
                      key={row.id}
                      data-state={row.getIsSelected() && "selected"}
                    >
                      {row.getVisibleCells().map((cell) => (
                        <TableCell key={cell.id}>
                          {flexRender(
                            cell.column.columnDef.cell,
                            cell.getContext()
                          )}
                        </TableCell>
                      ))}
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell
                      colSpan={columns.length}
                      className="h-24 text-center"
                    >
                      No results.
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
          <div className="flex items-center justify-end space-x-2 py-4">
            <div className="flex-1 text-sm text-muted-foreground">
              {table.getFilteredSelectedRowModel().rows.length} of{" "}
              {table.getFilteredRowModel().rows.length} row(s) selected.
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.previousPage()}
                disabled={!table.getCanPreviousPage()}
              >
                Previous
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => table.nextPage()}
                disabled={!table.getCanNextPage()}
              >
                Next
              </Button>
            </div>
          </div>
        </div>

        <SheetFooter>
          <SheetClose asChild>
            <Button type="submit" onClick={onSubmit}>Save changes</Button>
          </SheetClose>
        </SheetFooter>
        {/* <CategoryForm onSubmit={onSubmit} disabled={mutation.isPending} /> */}
      </SheetContent>
    </Sheet>
  );
};
