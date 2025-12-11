import { ReactNode } from 'react';

interface FieldRowProps {
  children: ReactNode;
  gap?: string;
}

export function FieldRow({ children, gap }: FieldRowProps) {
  return <div className={`flex items-center ${gap || 'gap-6'} mb-4`}>{children}</div>;
}
