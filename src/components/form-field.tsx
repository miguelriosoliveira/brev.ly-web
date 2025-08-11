import type { ComponentProps } from 'react';
import { Warning } from '../icons/warning';

interface Props extends ComponentProps<'input'> {
  label: string;
  fixedPlaceholder?: boolean;
  error?: string;
}

export function FormField({ label, fixedPlaceholder = false, error, ...inputProps }: Props) {
  return (
    <div className="group relative">
      <label
        className="flex flex-col gap-2 font-xs-uppercase group-focus-within:font-semibold group-focus-within:text-blue-base"
        htmlFor={inputProps.id}
      >
        {label}
      </label>

      <input
        className="my-2 w-full rounded-lg px-4 py-3.5 text-base text-gray-600 caret-blue-base outline outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:outline-blue-base data-[fixedplaceholder=true]:pl-16"
        data-fixedplaceholder={fixedPlaceholder}
        {...inputProps}
        placeholder={fixedPlaceholder ? undefined : inputProps.placeholder}
      />

      {fixedPlaceholder && (
        <span className="absolute top-9 left-4 w-fit text-base text-gray-400">
          {inputProps.placeholder}
        </span>
      )}

      {!!error && (
        <div className="flex items-center gap-2">
          <Warning className="text-danger" size={16} />
          <span className="text-gray-500 text-sm">{error}</span>
        </div>
      )}
    </div>
  );
}
