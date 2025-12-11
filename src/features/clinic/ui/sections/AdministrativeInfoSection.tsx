import { SectionTitle } from '../components/SectionTitle';
import { InlineField } from '../components/InlineField';
import { FieldRow } from '../components/FieldRow';

export function AdministrativeInfoSection() {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-5 mb-5">
      <SectionTitle number="I" title="HÀNH CHÍNH" />

      <FieldRow>
        <InlineField label="Họ và tên" required width="flex-1" />
        <InlineField label="Ngày sinh" required width="w-32" />
        <InlineField label="Tuổi" width="w-16" />
      </FieldRow>

      <FieldRow>
        <InlineField label="Giới tính" required width="w-32" />
        <InlineField label="Dân tộc" width="w-32" />
        <InlineField label="Quốc tịch" width="flex-1" />
      </FieldRow>

      <FieldRow>
        <InlineField label="Nghề nghiệp" width="flex-1" />
        <InlineField label="Nơi làm việc" width="flex-1" />
      </FieldRow>

      <FieldRow>
        <InlineField label="CMND/CCCD" required width="flex-1" />
        <InlineField label="Ngày cấp" width="w-32" />
        <InlineField label="Nơi cấp" width="w-40" />
      </FieldRow>

      <FieldRow>
        <InlineField label="Địa chỉ thường trú" required width="flex-1" />
      </FieldRow>

      <FieldRow>
        <InlineField label="Tỉnh/TP" required width="flex-1" />
        <InlineField label="Quận/Huyện" required width="flex-1" />
        <InlineField label="Xã/Phường" required width="flex-1" />
      </FieldRow>

      <FieldRow>
        <InlineField label="Điện thoại" required width="w-40" />
        <InlineField label="Email" width="flex-1" />
      </FieldRow>

      <FieldRow>
        <InlineField label="Người liên hệ" width="flex-1" />
        <InlineField label="SĐT người liên hệ" width="w-40" />
      </FieldRow>
    </div>
  );
}
