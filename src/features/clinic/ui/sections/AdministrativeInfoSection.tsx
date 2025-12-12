import { SectionTitle } from '../components/SectionTitle';
import { InlineField } from '../components/InlineField';

export function AdministrativeInfoSection() {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-5 mb-5">
      <SectionTitle number="I" title="HÀNH CHÍNH" />

      <div className="grid grid-cols-3 gap-x-8 gap-y-3">
        {/* Row 1 */}
        <InlineField label="Họ và tên" required />
        <InlineField label="Ngày sinh" required />
        <InlineField label="Tuổi" />

        {/* Row 2 */}
        <InlineField label="Giới tính" required />
        <InlineField label="Dân tộc" />
        <InlineField label="Quốc tịch" />

        {/* Row 3 */}
        <InlineField label="Nghề nghiệp" />
        <InlineField label="Nơi làm việc" className="col-span-2" />

        {/* Row 4 */}
        <InlineField label="CMND/CCCD" required />
        <InlineField label="Ngày cấp" />
        <InlineField label="Nơi cấp" />

        {/* Row 5 */}
        <InlineField label="Địa chỉ thường trú" required className="col-span-3" />

        {/* Row 6 */}
        <InlineField label="Tỉnh/TP" required />
        <InlineField label="Quận/Huyện" required />
        <InlineField label="Xã/Phường" required />

        {/* Row 7 */}
        <InlineField label="Điện thoại" required />
        <InlineField label="Email" className="col-span-2" />

        {/* Row 8 */}
        <InlineField label="Người liên hệ" className="col-span-2" />
        <InlineField label="SĐT người liên hệ" />
      </div>
    </div>
  );
}
