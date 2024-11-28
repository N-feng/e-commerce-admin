"use client"

import { ColumnDef } from "@tanstack/react-table"

import { CellAction } from "./cell-action"
import CellImage from "./cell-image"

export type MealColumn = {
  id: string
  name: string;
  // price: string;
  // category: string;
  // size: string;
  // color: string;
  // kitchen: string;
  // cuisine: string;
  createdAt: string;
  // isFeatured: boolean;
  // isArchived: boolean;
}

export const columns: ColumnDef<MealColumn>[] = [
  // {
  //   accessorKey: "images",
  //   header: "Images",
  //   cell: ({ row }) => (
  //     <div className="grid grid-cols-2 gap-2">
  //       <CellImage data={row.original.images} />
  //     </div>
  //   ),
  // },
  {
    accessorKey: "products",
    header: "Products",
  },
  {
    accessorKey: "name",
    header: "Name",
  },
  {
    accessorKey: "createdAt",
    header: "Date",
  },
  {
    id: "actions",
    cell: ({ row }) => <CellAction data={row.original} />
  },
];
