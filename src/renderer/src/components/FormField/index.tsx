import './styles.css';

interface FormFieldProps {
  label: string;
  required?: boolean;
  error?: string;
  children: React.ReactNode;
}

export function FormField({
  label,
  required,
  error,
  children,
}: FormFieldProps) {
  return (
    <div className="form-field">
      <label
        className={`form-field-label ${required ? 'form-field-label--required' : ''}`}
      >
        {label}
      </label>
      {children}
      {error && <span className="form-field-error">{error}</span>}
    </div>
  );
}
