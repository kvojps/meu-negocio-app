import { forwardRef } from 'react';
import './form-controls.css';

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  error?: boolean;
}

export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ error, className = '', ...props }, ref) => (
    <textarea
      ref={ref}
      className={`form-textarea ${error ? 'form-input--error' : ''} ${className}`.trim()}
      {...props}
    />
  ),
);

Textarea.displayName = 'Textarea';
