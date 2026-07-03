import { forwardRef } from 'react';
import './form-controls.css';

interface SelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  error?: boolean;
}

export const Select = forwardRef<HTMLSelectElement, SelectProps>(
  ({ error, className = '', children, ...props }, ref) => (
    <select
      ref={ref}
      className={`form-input form-select ${error ? 'form-input--error' : ''} ${className}`.trim()}
      {...props}
    >
      {children}
    </select>
  ),
);

Select.displayName = 'Select';
