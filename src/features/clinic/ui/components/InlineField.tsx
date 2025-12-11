interface InlineFieldProps {
  label: string;
  placeholder?: string;
  required?: boolean;
  width?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function InlineField({
  label,
  placeholder,
  required,
  width,
  value,
  onChange,
}: InlineFieldProps) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <span className="text-xs text-gray-700 whitespace-nowrap font-medium">
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}:
      </span>
      <input
        className={`medical-input ${width || 'flex-1'}`}
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
