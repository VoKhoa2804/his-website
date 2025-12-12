import { SectionTitle } from '../components/SectionTitle';
import { LongTextField } from '../components/LongTextField';

export function PhysicalExamSection() {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-5 mb-5">
      <SectionTitle number="IV" title="KHÁM XÉT" />

      <LongTextField label="Toàn thân" />
      <LongTextField label="Tuần hoàn" />
      <LongTextField label="Hô hấp" />
      <LongTextField label="Tiêu hóa" />
      <LongTextField label="Thận - Tiết niệu" />
      <LongTextField label="Thần kinh" />
      <LongTextField label="Cơ - Xương - Khớp" />
      <LongTextField label="Tai - Mũi - Họng" />
      <LongTextField label="Răng - Hàm - Mặt" />
      <LongTextField label="Mắt" />
      <LongTextField label="Khác" />
    </div>
  );
}
