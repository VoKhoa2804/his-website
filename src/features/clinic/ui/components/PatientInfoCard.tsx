interface PatientInfoCardProps {
  name: string;
  gender: string;
  age: number;
  bloodType: string;
  mrn: string;
  patientCode: string;
  admissionDate: string;
  financialSummary: {
    totalFee: number;
    paid: number;
    insurance: number;
    debt: number;
  };
}

export function PatientInfoCard({
  name,
  gender,
  age,
  bloodType,
  mrn,
  patientCode,
  admissionDate,
  financialSummary,
}: PatientInfoCardProps) {
  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('vi-VN').format(amount) + 'đ';
  };

  return (
    <div className="bg-white border border-gray-200 rounded-md shadow-sm p-4 mb-4">
      <div className="flex items-start gap-3 mb-3">
        <div className="w-16 h-16 rounded-full bg-gray-200 flex items-center justify-center text-gray-500 text-2xl font-bold overflow-hidden">
          {name.charAt(0)}
        </div>
        <div className="flex-1">
          <h3 className="text-base font-semibold text-gray-900">{name}</h3>
          <p className="text-xs text-gray-600">
            {gender} | {age} tuổi | {bloodType}
          </p>
        </div>
      </div>

      <div className="space-y-1 mb-3 text-xs text-gray-700">
        <div>MRN: {mrn}</div>
        <div>Mã BN: {patientCode}</div>
        <div>Ngày vào: {admissionDate}</div>
      </div>

      <div className="grid grid-cols-2 gap-1 text-[11px] mt-3 pt-3 border-t border-gray-200">
        <div className="text-gray-700">Viện phí</div>
        <div className="text-right font-medium">{formatCurrency(financialSummary.totalFee)}</div>

        <div className="text-gray-700">Đã thanh toán</div>
        <div className="text-right font-medium text-green-600">
          {formatCurrency(financialSummary.paid)}
        </div>

        <div className="text-gray-700">Bảo hiểm</div>
        <div className="text-right font-medium text-blue-600">
          {formatCurrency(financialSummary.insurance)}
        </div>

        <div className="text-gray-700">Còn nợ</div>
        <div className="text-right font-medium text-red-600">
          {formatCurrency(financialSummary.debt)}
        </div>
      </div>
    </div>
  );
}
