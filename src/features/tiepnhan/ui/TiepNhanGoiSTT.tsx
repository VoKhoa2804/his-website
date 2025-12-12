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
      <Card className="border border-gray-300 shadow-sm h-full">
      {/* HEADER */}
      <CardHeader className="bg-sky-700 text-white px-4 py-3">
         <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-sm sm:text-xs font-bold tracking-wide flex items-center gap-2">
            <Clock className="w-4 h-4 text-white" />
            THÔNG TIN GỌI SỐ
          </CardTitle>
          {/* <CardDescription className="text-[11px] text-white/80">
            Kiểm tra kỹ thông tin trước khi lưu
          </CardDescription> */}
        </div>
        
      </CardHeader>

      {/* BODY */}
      <CardContent className="p-3 sm:p-4 space-y-4">
<Field label="Quầy gọi số">
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
           <SelectTrigger className="h-8 text-xs bg-white">
                  <SelectValue placeholder="Chọn buồng khám" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pk-01">PK 01</SelectItem>
                  <SelectItem value="pk-02">PK 02</SelectItem>
                  <SelectItem value="pk-03">PK 03</SelectItem>
                </SelectContent>
          </Select>
        </Field>

        <div className="grid grid-cols-2 gap-2">

        <Field label="Quầy gọi số">
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
           <SelectTrigger className="h-8 text-xs bg-white">
                  <SelectValue placeholder="Chọn buồng khám" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pk-01">PK 01</SelectItem>
                  <SelectItem value="pk-02">PK 02</SelectItem>
                  <SelectItem value="pk-03">PK 03</SelectItem>
                </SelectContent>
          </Select>
        </Field>
            <Label className="text-xs text-gray-300">Số hiện tai : 909</Label>
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

function Field({
  label,
  children,
  required,
}: {
  label: string;
  children: React.ReactNode;
  required?: boolean;
}) {
  // Tách sao nếu label có *
  const hasStar = label.includes("*");
  const cleanLabel = hasStar ? label.replace("*", "").trim() : label;

  return (
    <div className="space-y-1">
      <Label className="text-[13px] sm:text-sm md:text-base text-gray-700 flex items-center gap-1">
        {cleanLabel}
        {(required || hasStar) && (
          <span className="text-red-600">*</span>
        )}
      </Label>

      {children}
    </div>
  );
}

