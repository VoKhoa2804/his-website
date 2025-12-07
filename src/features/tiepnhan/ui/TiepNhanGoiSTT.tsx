import { Button } from "@/shared/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/shared/ui/select";
import { Label } from "@radix-ui/react-label";
import { ChevronRight, Clock, X } from "lucide-react";
import { useState } from "react";

export function TiepNhanGoiSTT() {
  const [selectedCounter, setSelectedCounter] = useState<string>("auto");
  const [currentCounter, setCurrentCounter] = useState<string>("Quầy 01");
  const [waitingCount] = useState<number>(5);
  const [calledCount] = useState<number>(12);

  return (
    <Card className="bg-gray-900 border border-gray-700 text-gray-100">
      {/* Header */}
      <CardHeader className="flex flex-row items-center gap-2 pb-3 pt-2 px-4">
        <Clock className="w-4 h-4 text-gray-400" />
        <CardTitle className="text-sm font-semibold text-white">
          Chọn quầy
        </CardTitle>
      </CardHeader>

      <CardContent className="px-4 pb-4 pt-0 space-y-3">
        {/* 1. Quầy tự chọn */}
        <div className="space-y-1.5">
          <Label className="text-xs text-gray-300">Quầy tự chọn</Label>
          <Select
            value={selectedCounter}
            onValueChange={(value) => {
              setSelectedCounter(value);
              if (value === "auto") {
                setCurrentCounter("Quầy 01");
              } else {
                setCurrentCounter(`Quầy ${value.padStart(2, "0")}`);
              }
            }}
          >
            <SelectTrigger className="h-8 bg-gray-800 border-gray-700 text-xs">
              <SelectValue placeholder="Chọn quầy làm việc" />
            </SelectTrigger>
            <SelectContent className="bg-gray-900 border-gray-700 text-xs">
              <SelectItem value="auto">Quầy tự chọn</SelectItem>
              <SelectItem value="1">Quầy 01</SelectItem>
              <SelectItem value="2">Quầy 02</SelectItem>
              <SelectItem value="3">Quầy 03</SelectItem>
              <SelectItem value="4">Quầy 04</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* 2. Thông tin quầy & số lượng NB */}
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300">Quầy đang làm việc</Label>
            <Input
              readOnly
              value={currentCounter}
              className="h-8 bg-gray-800 border-gray-700 text-xs text-gray-100"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300">
              Số NB đang chờ tại quầy
            </Label>
            <Input
              readOnly
              value={waitingCount}
              className="h-8 bg-gray-800 border-gray-700 text-xs text-right"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300">
              Số NB đã được gọi
            </Label>
            <Input
              readOnly
              value={calledCount}
              className="h-8 bg-gray-800 border-gray-700 text-xs text-right"
            />
          </div>

          <div className="space-y-1.5">
            <Label className="text-xs text-gray-300">Ghi chú</Label>
            <Input
              placeholder="Ghi chú thêm..."
              className="h-8 bg-gray-800 border-gray-700 text-xs placeholder:text-gray-500"
            />
          </div>
        </div>

        {/* 3. Nút thao tác */}
        <div className="flex gap-2 pt-2">
          <Button
            className="flex-1 h-9 text-xs font-medium flex items-center justify-center gap-2"
          >
            <span>NB tiếp theo [F1]</span>
            <ChevronRight className="w-4 h-4" />
          </Button>

          <Button
            variant="outline"
            className="h-9 text-xs border-gray-600 bg-gray-800 text-gray-100 hover:bg-gray-700 flex items-center gap-2"
          >
            <X className="w-4 h-4" />
            <span>Đóng quầy</span>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
