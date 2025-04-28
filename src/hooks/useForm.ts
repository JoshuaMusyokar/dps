import { useState, ChangeEvent, FormEvent } from "react";

type FormValues = Record<string, any>;
type FormErrors = Record<string, string>;
type ValidationRules = Record<string, (value: any) => string | null>;

interface UseFormOptions<T extends FormValues> {
  initialValues: T;
  validationRules?: ValidationRules;
  onSubmit?: (values: T) => void | Promise<void>;
}

interface UseFormReturn<T extends FormValues> {
  values: T;
  errors: FormErrors;
  touched: Record<string, boolean>;
  handleChange: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleBlur: (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => void;
  handleSubmit: (e: FormEvent) => void;
  setValue: (name: string, value: any) => void;
  setValues: (values: Partial<T>) => void;
  setError: (name: string, error: string) => void;
  setErrors: (errors: FormErrors) => void;
  clearErrors: () => void;
  isSubmitting: boolean;
  isValid: boolean;
  resetForm: () => void;
}

export function useForm<T extends FormValues>({
  initialValues,
  validationRules = {},
  onSubmit,
}: UseFormOptions<T>): UseFormReturn<T> {
  const [values, setValuesState] = useState<T>(initialValues);
  const [errors, setErrorsState] = useState<FormErrors>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  // Validate a single field
  const validateField = (name: string, value: any): string | null => {
    const rule = validationRules[name];
    return rule ? rule(value) : null;
  };

  // Validate all fields
  const validateForm = (): FormErrors => {
    const newErrors: FormErrors = {};

    Object.keys(values).forEach((name) => {
      const error = validateField(name, values[name]);
      if (error) {
        newErrors[name] = error;
      }
    });

    return newErrors;
  };

  // Handle input change
  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name, value, type } = e.target;

    // Handle checkbox inputs
    const val =
      type === "checkbox" ? (e.target as HTMLInputElement).checked : value;

    setValue(name, val);
  };

  // Handle input blur
  const handleBlur = (
    e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>
  ) => {
    const { name } = e.target;

    setTouched((prev) => ({ ...prev, [name]: true }));

    const error = validateField(name, values[name]);
    if (error) {
      setErrorsState((prev) => ({ ...prev, [name]: error }));
    } else {
      setErrorsState((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    const allTouched = Object.keys(values).reduce(
      (acc, key) => ({ ...acc, [key]: true }),
      {}
    );
    setTouched(allTouched);

    // Validate all fields
    const formErrors = validateForm();
    setErrorsState(formErrors);

    // If no errors and onSubmit callback provided
    if (Object.keys(formErrors).length === 0 && onSubmit) {
      setIsSubmitting(true);
      try {
        await onSubmit(values);
      } finally {
        setIsSubmitting(false);
      }
    }
  };

  // Set a single value
  const setValue = (name: string, value: any) => {
    setValuesState((prev) => ({ ...prev, [name]: value }));

    // If field was previously touched, validate on change
    if (touched[name]) {
      const error = validateField(name, value);
      if (error) {
        setErrorsState((prev) => ({ ...prev, [name]: error }));
      } else {
        setErrorsState((prev) => {
          const newErrors = { ...prev };
          delete newErrors[name];
          return newErrors;
        });
      }
    }
  };

  // Set multiple values at once
  const setValues = (newValues: Partial<T>) => {
    setValuesState((prev) => ({ ...prev, ...newValues }));

    // Validate touched fields
    const newErrors: FormErrors = { ...errors };

    Object.keys(newValues).forEach((name) => {
      if (touched[name]) {
        const error = validateField(name, newValues[name]);
        if (error) {
          newErrors[name] = error;
        } else {
          delete newErrors[name];
        }
      }
    });

    setErrorsState(newErrors);
  };

  // Set a single error
  const setError = (name: string, error: string) => {
    setErrorsState((prev) => ({ ...prev, [name]: error }));
  };

  // Set multiple errors at once
  const setErrors = (newErrors: FormErrors) => {
    setErrorsState(newErrors);
  };

  // Clear all errors
  const clearErrors = () => {
    setErrorsState({});
  };

  // Reset form to initial state
  const resetForm = () => {
    setValuesState(initialValues);
    setErrorsState({});
    setTouched({});
    setIsSubmitting(false);
  };

  return {
    values,
    errors,
    touched,
    handleChange,
    handleBlur,
    handleSubmit,
    setValue,
    setValues,
    setError,
    setErrors,
    clearErrors,
    isSubmitting,
    isValid: Object.keys(errors).length === 0,
    resetForm,
  };
}
