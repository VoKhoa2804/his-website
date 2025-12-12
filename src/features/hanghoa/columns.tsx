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
import { HangHoaStatusBadge } from "./HangHoaStatusBadge"
import { HangHoaResponseItem } from "@/entities/hanghoa.model"


export const columns: ColumnDef<HangHoaResponseItem>[] = [
  {
    accessorKey: "ma",
    header: "Mã",
    cell: ({ row }) => (
      <div className="font-medium">{row.getValue("ma") as string}</div>
    ),
  },
  {
    accessorKey: "ten",
    header: "Tên hàng hóa",
    cell: ({ row }) => <div>{row.getValue("ten") as string}</div>,
  },
  {
    accessorKey: "don_vi",
    header: "Đơn vị",
    cell: ({ row }) => <div>{row.getValue("don_vi") as string}</div>,
  },
  {
    accessorKey: "don_gia_ban",
    header: "Đơn giá bán",
    cell: ({ row }) => {
      const value = row.getValue<number>("don_gia_ban") ?? 0
      const formatted = new Intl.NumberFormat("vi-VN").format(value)
      return <div className="text-right tabular-nums">{formatted}</div>
    },
  },
  {
    accessorKey: "ten_phan_loai",
    header: "Phân loại",
    cell: ({ row }) => <div>{row.getValue("ten_phan_loai") as string}</div>,
  },
  {
    accessorKey: "ten_phan_nhom",
    header: "Phân nhóm",
    cell: ({ row }) => <div>{row.getValue("ten_phan_nhom") as string}</div>,
  },
  {
    accessorKey: "hien_thi",
    header: "Hiển thị",
    cell: ({ row }) => (
      <HangHoaStatusBadge active={row.getValue("hien_thi") as boolean} />
    ),
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row, table }) => {
      const item = row.original

      const meta = table.options.meta as
        | {
            onEdit: (id: string) => void
            onDelete: (id: string) => void
          }
        | undefined

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
              onClick={() => navigator.clipboard.writeText(item.id)}
            >
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => meta?.onEdit(item.id)}>
              Sửa
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => meta?.onDelete(item.id)}>
              Xóa
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]
