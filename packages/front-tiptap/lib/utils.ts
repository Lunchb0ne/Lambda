import { useState } from 'react';

export function useFormFields<T>(
  initialValues: T
): [
  T,
  (event: React.ChangeEvent<HTMLInputElement>) => void,
  () => void,
  (name: string, value: string) => void
] {
  const [values, setValues] = useState<T>(initialValues);
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    event.persist();
    const { target } = event;
    const { name, value } = target;
    setValues({ ...values, [name]: value });
  };
  const resetFormFields = () => setValues(initialValues);
  const quietChanges = (name, value) => {
    setValues({ ...values, [name]: value });
  };
  return [values, handleChange, resetFormFields, quietChanges];
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}
