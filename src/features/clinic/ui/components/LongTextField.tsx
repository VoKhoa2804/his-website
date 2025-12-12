import { AutoResizeTextarea } from '@/shared/ui/auto-resize-textarea';

interface LongTextFieldProps {
  label: string;
  placeholder?: string;
  required?: boolean;
  rows?: number;
  value?: string;
  onChange?: (value: string) => void;
}

export function LongTextField({
  label,
  placeholder,
  required,
  value,
  onChange,
}: LongTextFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}:
      </label>
      <AutoResizeTextarea
        className="w-full medical-input min-h-[32px] p-2"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
