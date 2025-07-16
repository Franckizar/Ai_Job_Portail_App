import { FieldError, UseFormRegister, Path, FieldValues } from "react-hook-form";
import React from "react";

export interface InputFieldProps<T extends FieldValues> { // <-- add extends FieldValues
  label: string;
  name: Path<T>;
  type: string;
  defaultValue?: string;
  register: UseFormRegister<T>;
  error?: FieldError;
  className?: string;
  inputClassName?: string;
  step?: string;
  disabled?: boolean;
}

function InputField<T extends FieldValues>({ // <-- add extends FieldValues
  label,
  name,
  type,
  defaultValue,
  register,
  error,
  className,
  inputClassName,
  step,
  disabled,
}: InputFieldProps<T>) {
  return (
    <div className={className}>
      <label className="text-lg font-medium text-gray-700">{label}</label>
      <input
        {...register(name)}
        type={type}
        defaultValue={defaultValue}
        step={step}
        disabled={disabled}
        className={inputClassName}
      />
      {error?.message && (
        <p className="text-lg text-red-600 mt-1">{error.message}</p>
      )}
    </div>
  );
}

export default InputField;
