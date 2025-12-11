import { SectionTitle } from '../components/SectionTitle';
import { LongTextField } from '../components/LongTextField';

export function PhysicalExamSection() {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-5 mb-5">
      <SectionTitle number="IV" title="KHÁM XÉT" />

      <LongTextField label="Toàn thân" rows={2} />
      <LongTextField label="Tuần hoàn" rows={2} />
      <LongTextField label="Hô hấp" rows={2} />
      <LongTextField label="Tiêu hóa" rows={2} />
      <LongTextField label="Thận - Tiết niệu" rows={2} />
      <LongTextField label="Thần kinh" rows={2} />
      <LongTextField label="Cơ - Xương - Khớp" rows={2} />
      <LongTextField label="Tai - Mũi - Họng" rows={2} />
      <LongTextField label="Răng - Hàm - Mặt" rows={2} />
      <LongTextField label="Mắt" rows={2} />
      <LongTextField label="Khác" rows={2} />
    </div>
  );
}
