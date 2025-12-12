interface Department {
  id: string;
  name: string;
  timestamp: string;
}

interface DepartmentTagsProps {
  departments: Department[];
  onDepartmentClick?: (id: string) => void;
}

export function DepartmentTags({ departments, onDepartmentClick }: DepartmentTagsProps) {
  if (departments.length === 0) return null;

  return (
    <div className="mb-4">
      <h4 className="text-xs font-medium text-gray-700 mb-2">Các khoa đã khám:</h4>
      <div className="space-y-2">
        {departments.map((dept) => (
          <button
            key={dept.id}
            onClick={() => onDepartmentClick?.(dept.id)}
            className="w-full text-left px-3 py-2 bg-blue-50 border border-blue-200 rounded hover:bg-blue-100 transition-colors"
          >
            <div className="font-medium text-blue-900 text-[11px]">{dept.name}</div>
            <div className="text-[10px] text-gray-600 mt-0.5">{dept.timestamp}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
