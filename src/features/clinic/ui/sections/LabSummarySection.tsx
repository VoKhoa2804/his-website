import { SectionTitle } from '../components/SectionTitle';
import { LongTextField } from '../components/LongTextField';

export function LabSummarySection() {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-5 mb-5">
      <SectionTitle number="VII" title="TÓM TẮT KẾT QUẢ CLS" />

      <div className="overflow-x-auto mb-4">
        <table className="w-full border border-gray-300 text-xs">
          <thead className="bg-gray-50">
            <tr>
              <th className="border-b border-gray-300 p-2 text-left font-medium">
                Loại xét nghiệm
              </th>
              <th className="border-b border-gray-300 p-2 text-left font-medium">Kết quả</th>
              <th className="border-b border-gray-300 p-2 text-left font-medium">Đơn vị</th>
              <th className="border-b border-gray-300 p-2 text-left font-medium">Tham chiếu</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border-b border-dotted border-gray-300 p-2">Huyết học</td>
              <td className="border-b border-dotted border-gray-300 p-2">
                <input className="medical-input w-full" />
              </td>
              <td className="border-b border-dotted border-gray-300 p-2">
                <input className="medical-input w-full" />
              </td>
              <td className="border-b border-dotted border-gray-300 p-2">
                <input className="medical-input w-full" />
              </td>
            </tr>
            <tr>
              <td className="border-b border-dotted border-gray-300 p-2">Sinh hóa</td>
              <td className="border-b border-dotted border-gray-300 p-2">
                <input className="medical-input w-full" />
              </td>
              <td className="border-b border-dotted border-gray-300 p-2">
                <input className="medical-input w-full" />
              </td>
              <td className="border-b border-dotted border-gray-300 p-2">
                <input className="medical-input w-full" />
              </td>
            </tr>
            <tr>
              <td className="border-b border-dotted border-gray-300 p-2">Chẩn đoán hình ảnh</td>
              <td className="border-b border-dotted border-gray-300 p-2">
                <input className="medical-input w-full" />
              </td>
              <td className="border-b border-dotted border-gray-300 p-2">
                <input className="medical-input w-full" />
              </td>
              <td className="border-b border-dotted border-gray-300 p-2">
                <input className="medical-input w-full" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <LongTextField label="Kết luận" rows={3} />
    </div>
  );
}
