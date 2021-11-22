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

export const fetcher = (
  input: RequestInfo,
  init: RequestInit,
  ...args: any[]
) => fetch(input, init).then((res) => res.json());

export async function postData(url = '', data = {}) {
  // Default options are marked with *
  const response = await fetch(url, {
    method: 'POST', // *GET, POST, PUT, DELETE, etc.
    mode: 'cors', // no-cors, *cors, same-origin
    cache: 'no-cache', // *default, no-cache, reload, force-cache, only-if-cached
    credentials: 'same-origin', // include, *same-origin, omit
    headers: {
      'Content-Type': 'application/json',
      // 'Content-Type': 'application/x-www-form-urlencoded',
    },
    redirect: 'follow', // manual, *follow, error
    referrerPolicy: 'no-referrer', // no-referrer, *no-referrer-when-downgrade, origin, origin-when-cross-origin, same-origin, strict-origin, strict-origin-when-cross-origin, unsafe-url
    body: JSON.stringify(data), // body data type must match "Content-Type" header
  });
  return response.json(); // parses JSON response into native JavaScript objects
}
