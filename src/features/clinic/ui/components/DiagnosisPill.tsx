interface DiagnosisPillProps {
  code: string;
  name: string;
  onRemove?: () => void;
}

export function DiagnosisPill({ code, name, onRemove }: DiagnosisPillProps) {
  return (
    <div className="diagnosis-pill mr-2 mb-2">
      <span className="font-medium">{code}</span>
      <span>-</span>
      <span>{name}</span>
      {onRemove && (
        <button onClick={onRemove} className="text-blue-600 hover:text-blue-800 ml-1">
          ×
        </button>
      )}
    </div>
  );
}
