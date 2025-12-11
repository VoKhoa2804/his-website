import { SectionTitle } from '../components/SectionTitle';
import { LongTextField } from '../components/LongTextField';

export function MedicalHistorySection() {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-5 mb-5">
      <SectionTitle number="III" title="HỎI BỆNH" />

      <LongTextField label="Lý do khám" rows={2} />
      <LongTextField label="Bệnh sử" rows={3} />
      <LongTextField label="Tiền sử bệnh" rows={2} />
      <LongTextField label="Tiền sử gia đình" rows={2} />
      <LongTextField label="Dị ứng" rows={2} />
    </div>
  );
}
