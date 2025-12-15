import { useState } from 'react';
import { SectionTitle } from '../components/SectionTitle';
import { InlineField } from '../components/InlineField';
import { DiagnosisPill } from '../components/DiagnosisPill';
import { Button } from '@/shared/ui/button';
import { IcdSelectDialog, type IcdDialogResult } from '../IcdSelectDialog';

interface DiagnosisItem {
  id: string;
  code: string;
  name: string;
}

type DialogType = 'preliminary' | 'confirmed' | null;

export function DiagnosisSection() {
  const [preliminaryDiagnoses, setPreliminaryDiagnoses] = useState<DiagnosisItem[]>([]);
  const [confirmedDiagnoses, setConfirmedDiagnoses] = useState<DiagnosisItem[]>([]);
  const [additionalDiagnoses, setAdditionalDiagnoses] = useState<DiagnosisItem[]>([
    { id: '1', code: 'A09', name: 'Tiêu chảy' },
    { id: '2', code: 'J06', name: 'VĐTHN' },
  ]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [activeDialogType, setActiveDialogType] = useState<DialogType>(null);

  const handleRemoveDiagnosis = (
    id: string,
    type: 'preliminary' | 'confirmed' | 'additional'
  ) => {
    if (type === 'preliminary') {
      setPreliminaryDiagnoses((prev) => prev.filter((d) => d.id !== id));
    } else if (type === 'confirmed') {
      setConfirmedDiagnoses((prev) => prev.filter((d) => d.id !== id));
    } else {
      setAdditionalDiagnoses((prev) => prev.filter((d) => d.id !== id));
    }
  };

  const handleOpenDialog = (type: DialogType) => {
    setActiveDialogType(type);
    setDialogOpen(true);
  };

  const handleIcdConfirm = (result: IcdDialogResult) => {
    // Use actual ICD data from the dialog
    const newDiagnoses: DiagnosisItem[] = result.selectedRows.map((row) => ({
      id: row.id,
      code: row.code,
      name: row.name,
    }));

    if (activeDialogType === 'preliminary') {
      setPreliminaryDiagnoses((prev) => [...prev, ...newDiagnoses]);
    } else if (activeDialogType === 'confirmed') {
      setConfirmedDiagnoses((prev) => [...prev, ...newDiagnoses]);
    }
  };

  return (
    <div className="bg-white border border-gray-300 rounded-lg p-5 mb-5">
      <SectionTitle number="V" title="CHẨN ĐOÁN" />

      <div className="mb-4">
        <InlineField label="Chẩn đoán sơ bộ" required width="flex-1" />
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-gray-700 font-medium">ICD-10:</span>
          <input className="medical-input w-24" placeholder="Mã ICD" />
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => handleOpenDialog('preliminary')}
          >
            + Add
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap">
          {preliminaryDiagnoses.map((diag) => (
            <DiagnosisPill
              key={diag.id}
              code={diag.code}
              name={diag.name}
              onRemove={() => handleRemoveDiagnosis(diag.id, 'preliminary')}
            />
          ))}
        </div>
      </div>

      <div className="mb-4">
        <InlineField label="Chẩn đoán xác định" required width="flex-1" />
        <div className="flex items-center gap-3 mt-2">
          <span className="text-xs text-gray-700 font-medium">ICD-10:</span>
          <input className="medical-input w-24" placeholder="Mã ICD" />
          <Button 
            variant="outline" 
            size="sm" 
            className="text-xs"
            onClick={() => handleOpenDialog('confirmed')}
          >
            + Add
          </Button>
        </div>
        <div className="mt-2 flex flex-wrap">
          {confirmedDiagnoses.map((diag) => (
            <DiagnosisPill
              key={diag.id}
              code={diag.code}
              name={diag.name}
              onRemove={() => handleRemoveDiagnosis(diag.id, 'confirmed')}
            />
          ))}
        </div>
      </div>

      <div className="mb-2">
        <label className="block text-xs font-medium text-gray-700 mb-2">
          Chẩn đoán kèm theo:
        </label>
        <div className="flex flex-wrap">
          {additionalDiagnoses.map((diag) => (
            <DiagnosisPill
              key={diag.id}
              code={diag.code}
              name={diag.name}
              onRemove={() => handleRemoveDiagnosis(diag.id, 'additional')}
            />
          ))}
        </div>
      </div>

      <IcdSelectDialog
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        onConfirm={handleIcdConfirm}
        title={activeDialogType === 'preliminary' ? 'Chẩn đoán sơ bộ' : 'Chẩn đoán xác định'}
        initialSelectedIds={
          activeDialogType === 'preliminary'
            ? preliminaryDiagnoses.map(d => d.id)
            : activeDialogType === 'confirmed'
            ? confirmedDiagnoses.map(d => d.id)
            : []
        }
      />
    </div>
  );
}
