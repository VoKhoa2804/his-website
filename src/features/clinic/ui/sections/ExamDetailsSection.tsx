import { SectionTitle } from '../components/SectionTitle';
import { InlineField } from '../components/InlineField';
import { FieldRow } from '../components/FieldRow';
import { LongTextField } from '../components/LongTextField';

export function ExamDetailsSection() {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-5 mb-5">
      <SectionTitle number="VI" title="THÔNG TIN KHÁM BỆNH" />

      <FieldRow>
        <InlineField label="Bác sĩ khám" required width="flex-1" />
      </FieldRow>

      <FieldRow>
        <InlineField label="Khoa khám" required width="flex-1" />
        <InlineField label="Phòng khám" required width="flex-1" />
      </FieldRow>

      <FieldRow>
        <InlineField label="Ngày khám" required width="w-40" />
        <InlineField label="Giờ khám" width="w-32" />
        <InlineField label="Loại khám" width="w-40" />
      </FieldRow>

      <LongTextField label="Ghi chú" />
    </div>
  );
}
