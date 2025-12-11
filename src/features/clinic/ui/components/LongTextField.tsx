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
  rows,
  value,
  onChange,
}: LongTextFieldProps) {
  return (
    <div className="mb-4">
      <label className="block text-xs font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}:
      </label>
      <textarea
        className="w-full medical-input min-h-[60px] resize-none p-2"
        rows={rows || 3}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
