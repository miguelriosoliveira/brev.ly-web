import type { IconProps } from '@phosphor-icons/react';
import { type ComponentType, forwardRef } from 'react';

type Props = {
  Icon: ComponentType<IconProps>;
  message: string;
};

export const IconMessage = forwardRef<HTMLDivElement, Props>(({ Icon, message }, ref) => {
  return (
    <div className="w-full place-items-center border-gray-200 border-t pt-5 text-center" ref={ref}>
      <Icon className="text-gray-400" />
      <span className="font-xs-uppercase">{message}</span>
    </div>
  );
});
