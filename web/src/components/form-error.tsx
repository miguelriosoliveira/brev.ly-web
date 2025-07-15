import { Warning } from '../icons/warning';

type Props = {
  error: string;
};

export function FormError({ error }: Props) {
  return (
    <div className="flex items-center gap-1 ">
      <Warning className="text-danger" size={16} />
      <span className="text-sm">{error}</span>
    </div>
  );
}
