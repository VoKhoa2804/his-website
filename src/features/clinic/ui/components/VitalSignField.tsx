interface VitalSignFieldProps {
  label: string;
  value?: string;
  unit: string;
  onChange?: (value: string) => void;
}

export function VitalSignField({ label, value, unit, onChange }: VitalSignFieldProps) {
  return (
    <div className="flex items-center gap-3">
      <span className="text-xs text-gray-700 font-medium w-20">{label}:</span>
      <input
        className="medical-input w-20 text-center"
        value={value}
        onChange={(e) => onChange?.(e.target.value)}
      />
      <span className="text-xs text-gray-500 w-10">{unit}</span>
    </div>
  );
}
