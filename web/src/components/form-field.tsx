import type { InputHTMLAttributes } from 'react';
import { FormError } from './form-error';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  fixedPlaceholder?: boolean;
  hasError: boolean;
  errorMessage: string;
}

export function FormField({
  label,
  fixedPlaceholder = false,
  hasError,
  errorMessage,
  ...inputProps
}: Props) {
  return (
    <div className="flex flex-col gap-2">
      <label
        className="flex flex-col gap-2 text-xs-uppercase"
        htmlFor={inputProps.id}
      >
        {label}
      </label>

      <input
        className="w-full rounded-lg px-4 py-3.5 text-base text-gray-600 outline outline-gray-300 placeholder:text-gray-400 data-[fixedplaceholder=true]:pl-16"
        data-fixedplaceholder={fixedPlaceholder}
        {...inputProps}
        placeholder={fixedPlaceholder ? undefined : inputProps.placeholder}
      />

      {fixedPlaceholder && (
        <span className="relative bottom-10 ml-4 w-fit text-base text-gray-400">
          {inputProps.placeholder}
        </span>
      )}

      {hasError && <FormError error={errorMessage} />}
    </div>
  );
}
