interface InlineFieldProps {
  label: string;
  placeholder?: string;
  required?: boolean;
  width?: string;
  className?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export function InlineField({
  label,
  placeholder,
  required,
  width,
  className,
  value,
  onChange,
}: InlineFieldProps) {
  return (
    <div className={`flex items-center gap-2 min-w-0 w-full ${className || ''}`}>
      <label className="text-xs text-gray-700 font-medium shrink-0 whitespace-nowrap" style={{ minWidth: '80px' }}>
        {label}
        {required && <span className="text-red-500 ml-0.5">*</span>}:
      </label>
      <input
        className="medical-input flex-1 min-w-0"
        placeholder={placeholder}
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
    </div>
  );
}
