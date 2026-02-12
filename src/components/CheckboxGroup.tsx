import React from 'react';

interface CheckboxOption {
  value: string;
  label: string;
}

interface CheckboxGroupProps {
  name: string;
  options: CheckboxOption[];
  values?: string[];
  onChange?: (name: string, values: string[]) => void;
  onBlur?: (name: string) => void;
  className?: string;
  error?: string;
  touched?: boolean;
}

export const CheckboxGroup: React.FC<CheckboxGroupProps> = ({
  name,
  options,
  values = [],
  onChange,
  onBlur,
  className = '',
  error,
  touched
}) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = e.target;
    let newValues: string[];
    
    if (checked) {
      newValues = [...values, value];
    } else {
      newValues = values.filter(v => v !== value);
    }
    
    onChange?.(name, newValues);
  };

  return (
    <div className={`checkbox-group ${className}`}>
      {options.map(option => (
        <label key={option.value} className="checkbox-label">
          <input
            type="checkbox"
            name={name}
            value={option.value}
            checked={values.includes(option.value)}
            onChange={handleChange}
            onBlur={() => onBlur?.(name)}
            className={`checkbox-input ${error && touched ? 'error' : ''}`}
          />
          {option.label}
        </label>
      ))}
      {error && touched && (
        <div className="error-message">{error}</div>
      )}
    </div>
  );
};