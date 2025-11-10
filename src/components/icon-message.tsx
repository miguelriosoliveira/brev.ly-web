import type { IconProps } from '@phosphor-icons/react';
import type { ComponentType, Ref } from 'react';

type Props = {
  Icon: ComponentType<IconProps>;
  message: string;
  ref?: Ref<HTMLDivElement>;
};

export function IconMessage({ Icon, message, ref }: Props) {
  return (
    <div className="w-full place-items-center border-gray-200 border-t pt-5 text-center" ref={ref}>
      <Icon className="text-gray-400" />
      <span className="font-xs-uppercase">{message}</span>
    </div>
  );
}
