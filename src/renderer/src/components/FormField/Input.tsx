import { forwardRef } from 'react';
import './form-controls.css';

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  error?: boolean;
}

export const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ error, className = '', ...props }, ref) => (
    <input
      ref={ref}
      className={`form-input ${error ? 'form-input--error' : ''} ${className}`.trim()}
      {...props}
    />
  ),
);

Input.displayName = 'Input';
