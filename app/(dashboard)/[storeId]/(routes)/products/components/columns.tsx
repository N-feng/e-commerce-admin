"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import CellImage from "./cell-image"

export type ProductColumn = {
  id: string
  name: string;
  price: string;
  category: string;
  // size: string;
  // color: string;
  kitchen: string;
  cuisine: string;
  images: [];
  createdAt: string;
  isFeatured: boolean;
  isArchived: boolean;
}

export const columns: ColumnDef<ProductColumn>[] = [
  {
    accessorKey: "images",
    header: "Images",
    cell: ({ row }) => (
      <div className="grid grid-cols-2 gap-2">
        <CellImage data={row.original.images} />
      </div>
    ),
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "chineseName",
    header: "ChineseName",
  },
  {
    accessorKey: "isArchived",
    header: "Archived",
  },
  {
    accessorKey: "isFeatured",
    header: "Featured",
  },
  {
    accessorKey: "price",
    header: "Price",
  },
  {
    accessorKey: "category",
    header: "Category",
  },
  // {
  //   accessorKey: "size",
  //   header: "Size",
  // },
  {
    accessorKey: "kitchen",
    header: "Kitchen",
  },
  {
    accessorKey: "cuisine",
    header: "Cuisine",
  },
  // {
  //   accessorKey: "color",
  //   header: "Color",
  //   cell: ({ row }) => (
  //     <div className="flex items-center gap-x-2">
  //       {row.original.color}
  //       <div className="h-6 w-6 rounded-full border" style={{ backgroundColor: row.original.color }} />
  //     </div>
  //   )
  // },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
