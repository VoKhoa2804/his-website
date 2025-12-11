interface Visit {
  id: string;
  date: string;
  department: string;
  doctor: string;
}

interface VisitHistoryListProps {
  visits: Visit[];
  onVisitClick?: (id: string) => void;
}

export function VisitHistoryList({ visits, onVisitClick }: VisitHistoryListProps) {
  if (visits.length === 0) return null;

  return (
    <div>
      <h4 className="text-xs font-medium text-gray-700 mb-2">Lịch sử khám:</h4>
      <div className="space-y-2 max-h-64 overflow-y-auto">
        {visits.map((visit) => (
          <button
            key={visit.id}
            onClick={() => onVisitClick?.(visit.id)}
            className="w-full text-left p-2 bg-gray-50 border border-gray-200 rounded hover:shadow-sm transition-shadow"
          >
            <div className="font-medium text-gray-900 text-[10px]">{visit.date}</div>
            <div className="text-gray-600 text-[10px]">{visit.department}</div>
            <div className="text-gray-600 text-[10px]">BS: {visit.doctor}</div>
          </button>
        ))}
      </div>
    </div>
  );
}
