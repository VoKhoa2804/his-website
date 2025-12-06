"use client"

import { ColumnDef } from "@tanstack/react-table"
import { MoreHorizontal } from "lucide-react"
import { Button } from "@/shared/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/shared/ui/dropdown-menu"
import { WorkShiftStatusBadge } from "./WorkShiftStatusBadge"
import type { WorkShift } from "../model/workShiftTypes"

export const columns: ColumnDef<WorkShift>[] = [
  {
    accessorKey: "ma",
    header: "Mã",
    cell: ({ row }) => <div>{row.getValue("ma")}</div>,
  },
  {
    accessorKey: "ten",
    header: "Tên",
    cell: ({ row }) => <div>{row.getValue("ten")}</div>,
  },
  {
    accessorKey: "hien_thi",
    header: "Hiển thị",
    cell: ({ row }) => <WorkShiftStatusBadge active={row.getValue("hien_thi")} />,
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const shift = row.original
      const meta = table.options.meta as {
        onEdit: (id: string) => void
        onDelete: (id: string) => void
      } | undefined

      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Thao tác</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(shift.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => meta?.onEdit(shift.id)}>
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta?.onDelete(shift.id)}>
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
