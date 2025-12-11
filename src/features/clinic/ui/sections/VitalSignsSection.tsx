import { SectionTitle } from '../components/SectionTitle';
import { VitalSignField } from '../components/VitalSignField';

export function VitalSignsSection() {
  return (
    <div className="bg-white border border-gray-300 rounded-lg p-5 mb-5">
      <SectionTitle number="II" title="SINH HIỆU" />

      <div className="grid grid-cols-3 gap-6">
        <VitalSignField label="Nhiệt độ" unit="°C" />
        <VitalSignField label="Mạch" unit="l/ph" />
        <VitalSignField label="HA" unit="mmHg" />

        <VitalSignField label="Nhịp thở" unit="l/ph" />
        <VitalSignField label="Cân nặng" unit="kg" />
        <VitalSignField label="Chiều cao" unit="cm" />

        <VitalSignField label="SpO₂" unit="%" />
        <VitalSignField label="BMI" unit="" />
        <VitalSignField label="Vòng bụng" unit="cm" />
      </div>
    </div>
  );
}
