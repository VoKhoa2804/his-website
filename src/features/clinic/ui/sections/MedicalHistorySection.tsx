import { SectionTitle } from '../components/SectionTitle';
import { LongTextField } from '../components/LongTextField';

export function MedicalHistorySection() {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-5 mb-5">
      <SectionTitle number="III" title="HỎI BỆNH" />

      <LongTextField label="Lý do khám" />
      <LongTextField label="Bệnh sử" />
      <LongTextField label="Tiền sử bệnh" />
      <LongTextField label="Tiền sử gia đình" />
      <LongTextField label="Dị ứng" />
    </div>
  );
}
