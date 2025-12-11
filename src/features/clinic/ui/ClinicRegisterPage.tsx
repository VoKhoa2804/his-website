import { useState } from 'react';
import { PatientInfoCard } from './components/PatientInfoCard';
import { DepartmentTags } from './components/DepartmentTags';
import { VisitHistoryList } from './components/VisitHistoryList';
import { AdministrativeInfoSection } from './sections/AdministrativeInfoSection';
import { VitalSignsSection } from './sections/VitalSignsSection';
import { MedicalHistorySection } from './sections/MedicalHistorySection';
import { PhysicalExamSection } from './sections/PhysicalExamSection';
import { DiagnosisSection } from './sections/DiagnosisSection';
import { ExamDetailsSection } from './sections/ExamDetailsSection';
import { LabSummarySection } from './sections/LabSummarySection';
import { Button } from '@/shared/ui/button';
import './medical-input.css';

export function ClinicRegisterPage() {
  // Mock data - will be replaced with Redux/API data
  const [patientData] = useState({
    name: 'Nguyễn Văn A',
    gender: 'Nam',
    age: 45,
    bloodType: 'AB+',
    mrn: '2024120001',
    patientCode: 'BN123456',
    admissionDate: '10/12/2025',
    financialSummary: {
      totalFee: 2500000,
      paid: 1000000,
      insurance: 500000,
      debt: 1000000,
    },
  });

  const [departments] = useState([
    {
      id: '1',
      name: 'Khám Ngoại lồng ngực',
      timestamp: '09:30 - 10/12/2025',
    },
    {
      id: '2',
      name: 'Khám Nội tim mạch',
      timestamp: '14:00 - 10/12/2025',
    },
  ]);

  const [visits] = useState([
    {
      id: '1',
      date: '08/12/2025',
      department: 'Khám nội tổng quát',
      doctor: 'Trần Thị B',
    },
    {
      id: '2',
      date: '15/11/2025',
      department: 'Khám sản',
      doctor: 'Lê Văn C',
    },
  ]);

  const handleSave = () => {
    // TODO: Implement save logic with Redux/API
    console.log('Save examination data');
  };

  const handlePrint = () => {
    // TODO: Implement print logic
    console.log('Print examination form');
  };

  return (
    <div className="h-screen bg-slate-50 flex flex-col">
      {/* Header Bar */}
      <div className="h-14 bg-gradient-to-r from-blue-600 to-blue-800 shadow-md flex items-center justify-between px-6 flex-shrink-0">
        <div className="flex items-center gap-4">
          <h1 className="text-white text-lg font-semibold">Phiếu khám bệnh</h1>
          <input
            type="text"
            placeholder="Tìm kiếm bệnh nhân..."
            className="px-3 py-1.5 rounded bg-white/20 text-white placeholder:text-white/70 text-sm focus:outline-none focus:bg-white/30 w-64"
          />
        </div>
        <div className="flex items-center gap-2">
          <Button variant="outline" size="sm" onClick={handlePrint} className="bg-white/10 text-white border-white/40 hover:bg-white/20">
            In phiếu
          </Button>
          <Button size="sm" onClick={handleSave} className="bg-white text-blue-600 hover:bg-gray-100">
            Lưu
          </Button>
        </div>
      </div>

      {/* Main Content Area */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Panel */}
        <div className="w-80 bg-white border-r border-gray-200 overflow-y-auto p-4 flex-shrink-0">
        <PatientInfoCard {...patientData} />
        <DepartmentTags
          departments={departments}
          onDepartmentClick={(id) => console.log('Department clicked:', id)}
        />
        <VisitHistoryList
          visits={visits}
          onVisitClick={(id) => console.log('Visit clicked:', id)}
        />
      </div>

        {/* Right Panel - Main Content */}
        <div className="flex-1 overflow-y-auto py-6 px-6">
          <div className="max-w-5xl mx-auto">
            <AdministrativeInfoSection />
            <VitalSignsSection />
            <MedicalHistorySection />
            <PhysicalExamSection />
            <DiagnosisSection />
            <ExamDetailsSection />
            <LabSummarySection />
          </div>
        </div>
      </div>
    </div>
  );
}
