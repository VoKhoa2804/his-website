interface SectionTitleProps {
  number: string;
  title: string;
}

export function SectionTitle({ number, title }: SectionTitleProps) {
  return (
    <div className="flex items-center gap-2 border-b border-gray-300 pb-3 mb-5">
      <span className="text-base font-semibold text-gray-900">{number}.</span>
      <h3 className="text-base font-semibold text-gray-900 uppercase tracking-wide">{title}</h3>
    </div>
  );
}
