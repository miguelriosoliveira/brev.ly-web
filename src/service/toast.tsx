import { type TypeOptions, toast } from 'react-toastify';

type Props = {
  type: TypeOptions;
  title: string;
  text: string;
};

export function notify({ type, title, text }: Props) {
  return toast(
    <div className="flex flex-col">
      <strong className="text-base">{title}</strong>
      <span className="text-sm">{text}</span>
    </div>,
    {
      type,
      position: 'bottom-right',
      theme: 'colored',
      hideProgressBar: true,
      closeButton: false,
    },
  );
}
