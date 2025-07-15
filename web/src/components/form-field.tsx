import type { InputHTMLAttributes } from 'react';
import { FormError } from './form-error';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  hasError: boolean;
  errorMessage: string;
}

export function FormField({
  label,
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
        className="w-full rounded-lg px-4 py-3.5 text-base text-gray-600 outline outline-gray-300 placeholder:text-gray-400"
        {...inputProps}
      />

      {hasError && <FormError error={errorMessage} />}
    </div>
  );
}
