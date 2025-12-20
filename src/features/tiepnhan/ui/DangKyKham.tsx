import {
  useMemo,
  useRef,
  useState,
  useEffect,
  type ReactNode,
  isValidElement,
  cloneElement,
  type ChangeEvent,
  type FocusEvent,
} from "react";
import { Hospital, User } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/shared/ui/card";
import { Input } from "@/shared/ui/input";
import { useTiepNhanForm } from "../hooks/useTiepNhanForm";
import { getFieldError } from "../model/tiepnhan.validation";
import {
  LookupField,
  LookupAutoCompleteGrid,
  type LookupAutoCompleteGridColumn,
} from "@/shared/ui/lookups";
import { useSelector } from "react-redux";
import { selectHanhChinhStatus, selectOptionsByKey } from "@/features/hanhchinh/model/hanhchinhSlice";
import { SectionTitle } from "@/shared/ui/sectiontitle";
import { Checkbox } from "@/shared/ui/checkbox";
import { ValidatedField } from "@/shared/ui/validated-field";

function toLookupOptions(items: Array<{ id: string; ma?: string; ten?: string }> = []) {
  return items
    .filter(Boolean)
    .map((item) => ({
      value: item.ma || item.id,
      label: item.ten || item.ma || item.id,
      ma: item.ma,
      meta: item,
    }))
}

const currencyFormatter = new Intl.NumberFormat("vi-VN", {
  maximumFractionDigits: 0,
})

function formatCurrency(value?: number | string | null) {
  if (value === undefined || value === null || value === "") {
    return "-"
  }
  const numericValue = typeof value === "number" ? value : Number(value)
  if (!Number.isFinite(numericValue)) {
    return "-"
  }
  return currencyFormatter.format(numericValue)
}

export function DangKyKham() {
  const { formData, updateDangKyKham, updateTheBaoHiem, fieldErrors } = useTiepNhanForm()
  const dangKyData = formData.dangKyKham
  const theBaoHiemData = formData.theBaoHiem
  const hanhChinhStatus = useSelector(selectHanhChinhStatus)
  const loading = hanhChinhStatus === "loading"
  const phongBanOptions = useSelector(selectOptionsByKey("PhongBan"))
  const uuTienOptions = useSelector(selectOptionsByKey("UuTien"))
  const bsGioiThieuOptions = useSelector(selectOptionsByKey("BsGioiThieu"))
  const loaiKcbOptions = useSelector(selectOptionsByKey("LoaiKCB"))
  const doiTuongKcbOptions = useSelector(selectOptionsByKey("DoiTuongKCB"))

  const loaiKcbLookupOptions = toLookupOptions(loaiKcbOptions)
  const doiTuongKcbLookupOptions = toLookupOptions(doiTuongKcbOptions)
  const phongBanLookupOptions = toLookupOptions(phongBanOptions)
  const uuTienLookupOptions = toLookupOptions(uuTienOptions)
  const bsGioiThieuLookupOptions = toLookupOptions(bsGioiThieuOptions)
  const phongBanColumns = useMemo<LookupAutoCompleteGridColumn[]>(
    () => [
      {
        header: "Mã phòng",
        accessor: (option) => option.ma ?? option.value,
        width: 20,
        searchValue: (option) => option.ma ?? option.value,
      },
      {
        header: "Tên phòng",
        accessor: (option) => option.label,
        width: 35,
        searchValue: (option) => option.label,
      },
      {
        header: "Loại thu",
        accessor: (option) => option.meta?.TenLoaiThu ?? "-",
        width: 25,
        searchValue: (option) => option.meta?.TenLoaiThu ?? "",
      },
      {
        header: "Đơn giá BHYT",
        accessor: (option) =>
          formatCurrency(option.meta?.DonGiaBHYT ?? option.meta?.DonGia ?? option.meta?.DonGiaDV),
        width: 20,
        searchValue: (option) =>
          String(option.meta?.DonGiaBHYT ?? option.meta?.DonGia ?? option.meta?.DonGiaDV ?? ""),
      },
    ],
    [],
  )

  return (
    <Card className="border border-sky-100 bg-sky-50/50 shadow-sm ring-1 ring-sky-200">
      {/* HEADER */}
      <CardHeader className="bg-sky-700 text-white px-4 py-3 shadow-sm shadow-sky-800/30">
        <div className="flex flex-col gap-1 sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-sm font-semibold tracking-wide flex items-center gap-2">
            <User className="w-4 h-4 text-white" />
            THÔNG TIN TIẾP ĐÓN
          </CardTitle>
          <CardDescription className="text-[11px] text-white/80">
            Kiểm tra kỹ thông tin trước khi lưu
          </CardDescription>
        </div>
      </CardHeader>

      {/* BODY */}
      <CardContent className="p-5 space-y-6">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-start">
          <div className="flex-1 grid grid-cols-1 gap-4 md:grid-cols-12">

            <div className="md:col-span-6">
              <LookupField
                label="Loại KCB"
                required
                value={dangKyData.visitType}
                onChange={(value) => updateDangKyKham({ visitType: value })}
                options={loaiKcbLookupOptions}
                loading={loading}
                error={getFieldError(fieldErrors, "dangKyKham.visitType")}
              />
            </div>

            <div className="md:col-span-6">
              <LookupField
                label="Đối tượng KCB"
                required
                value={dangKyData.department}
                onChange={(value) => updateDangKyKham({ department: value })}
                options={doiTuongKcbLookupOptions}
                loading={loading}
                error={getFieldError(fieldErrors, "dangKyKham.department")}
              />
            </div>
            <div className="md:col-span-6">

 <Field label="Hộ nghèo / cận nghèo">
               <div className="flex items-center gap-2">
                <Checkbox
                  id="poorHousehold"
               
                />
               
                <div className="flex-1 ml-3">
                  <Input
                    // value={baoHiemData.poorHouseholdNumber}
                    // onChange={(e) =>
                    //   updateTheBaoHiem({
                    //     poorHouseholdNumber: e.target.value,
                    //   })
                    // }
                    placeholder="Số sổ"
                  />
                </div>
              </div> 
              </Field>

            </div>
            <div className="md:col-span-6">
              <LookupField
                label="Loại ưu tiên"
                value={dangKyData.uuTien}
                onChange={(value) => {
                  updateDangKyKham({
                    uuTien: value,
                    priorityLevel: value, // TODO: remove priorityLevel when legacy usages are cleaned up
                  })
                }}
                options={uuTienLookupOptions}
                loading={loading}
                error={getFieldError(fieldErrors, "dangKyKham.uuTien")}
              />
            </div>
            {/* 2. THÔNG TIN LIÊN HỆ & NGƯỜI THÂN */}
            <div className="md:col-span-12">
              <SectionTitle label="Nơi chuyển tuyến" icon={Hospital} />
            </div>
            <div className="md:col-span-8">
              <LookupField
                label="Tên nơi chuyển tuyến (nếu có)"
                value={theBaoHiemData.referralPlace}
                valueLabel={theBaoHiemData.tenNoiChuyenTuyen}
                onChange={(value) =>
                  updateTheBaoHiem({
                    referralPlace: value,
                  })
                }
                onSelectOption={(option) =>
                  updateTheBaoHiem({
                    referralPlace: option.value,
                    tenNoiChuyenTuyen: option.label,
                  })
                }
                options={doiTuongKcbLookupOptions}
                loading={loading}
              />
            </div>
            <div className="md:col-span-4">
              <Field label="Giấy chuyển tuyến">
                <Input
                  value={theBaoHiemData.soGiayChuyenTuyen}
                  onChange={(e) =>
                    updateTheBaoHiem({ soGiayChuyenTuyen: e.target.value })
                  }
                  className="h-9 min-w-0 text-sm"
                  placeholder="Nhập số giấy"
                />
              </Field>
            </div>

            <div className="md:col-span-8">
              <Field label="Chẩn đoán">
                <Input
                  value={theBaoHiemData.chanDoan}
                  onChange={(e) =>
                    updateTheBaoHiem({ chanDoan: e.target.value })
                  }
                  className="h-9 min-w-0 text-sm"
                  placeholder="Nhập mô tả chẩn đoán"
                />
              </Field>
            </div>
            <div className="md:col-span-4">
              <Field label="Mã ICD chẩn đoán">
                <Input
                  value={theBaoHiemData.maIcdChanDoan}
                  onChange={(e) =>
                    updateTheBaoHiem({ maIcdChanDoan: e.target.value })
                  }
                  className="h-9 min-w-0 text-sm"
                  placeholder="VD: J18.9"
                />
              </Field>
            </div>

            <div className="md:col-span-12">
              <SectionTitle label="Đăng ký phòng khám" icon={Hospital} />
            </div>
            <div className="md:col-span-8">
              <Field
                label="Lý do đến khám"
                required
                error={getFieldError(fieldErrors, "dangKyKham.visitReason")}
                fieldPath="dangKyKham.visitReason"
              >
                <Input
                  value={dangKyData.visitReason}
                  onChange={(e) =>
                    updateDangKyKham({ visitReason: e.target.value })
                  }
                  placeholder="VD: Đau bụng, tái khám..."
                  className="h-9 text-sm"
                />
              </Field>
            </div>

            <div className="md:col-span-4">
              <LookupField
                label="Người giới thiệu"
                value={dangKyData.referrer}
                onChange={(value) => updateDangKyKham({ referrer: value })}
                options={bsGioiThieuLookupOptions}
                loading={loading}
              />
            </div>

            <div className="md:col-span-8">
              <LookupAutoCompleteGrid
                label="Phòng khám"
                required
                value={dangKyData.room}
                onChange={(value) => updateDangKyKham({ room: value })}
                options={phongBanLookupOptions}
                columns={phongBanColumns}
                loading={loading}
                error={getFieldError(fieldErrors, "dangKyKham.room")}
                placeholder="Chọn phòng"
                fieldPath="dangKyKham.room"
              />
            </div>

            <div className="md:col-span-4">
              <LookupField
                label="Đối tượng"
                value={dangKyData.uuTien}
                onChange={(value) => {
                  updateDangKyKham({
                    uuTien: value,
                    priorityLevel: value, // TODO: remove priorityLevel when legacy usages are cleaned up
                  })
                }}
                options={uuTienLookupOptions}
                loading={loading}
                error={getFieldError(fieldErrors, "dangKyKham.uuTien")}
              />
            </div>

          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* ============================== */
/* FIELD COMPONENT TÁI SỬ DỤNG    */
/* ============================== */
interface FieldProps {
  label: string;
  children: ReactNode;
  required?: boolean;
  error?: string;
  fieldPath?: string;
}

function Field({ label, children, required, error, fieldPath }: FieldProps) {
  const childElement = isValidElement(children) ? children : null;
  if (!childElement) {
    return null;
  }

  const supportsValidationProps = childElement.type === Input;
  const childValue = childElement.props?.value ?? "";
  const [touched, setTouched] = useState(false);
  const [dirty, setDirty] = useState(false);
  const valueRef = useRef(childValue);
  const valuePresent =
    typeof childValue === "string"
      ? childValue.trim().length > 0
      : childValue !== null && childValue !== undefined && childValue !== "";

  const handleBlur = (event: FocusEvent<HTMLInputElement>) => {
    if (!touched) {
      setTouched(true);
    }
    childElement?.props.onBlur?.(event);
  };

  const handleChange = (event: ChangeEvent<HTMLInputElement>) => {
    if (!dirty && valueRef.current !== event.target.value) {
      setDirty(true);
    }
    valueRef.current = event.target.value;
    childElement?.props.onChange?.(event);
  };

  useEffect(() => {
    valueRef.current = childValue;
  }, [childValue]);

  if (!childElement) {
    return null;
  }

  return (
    <ValidatedField
      label={label}
      required={required}
      error={error}
      touched={touched}
      dirty={dirty}
      valuePresent={valuePresent}
      fieldPath={fieldPath}
    >
      {({ validationState, showStatusIcon, statusIconAriaLabel }) => {
        if (!supportsValidationProps) {
          return childElement;
        }
        return cloneElement(childElement, {
          validationState,
          showStatusIcon,
          statusIconAriaLabel,
          onBlur: handleBlur,
          onChange: handleChange,
        });
      }}
    </ValidatedField>
  );
}
