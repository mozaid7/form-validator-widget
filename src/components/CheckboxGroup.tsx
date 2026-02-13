import React, { useEffect } from 'react';
import styles from '../styles/animations.module.css';

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

  // Notify form of blur when any checkbox loses focus
  const handleBlur = () => {
    onBlur?.(name);
  };

  return (
    <div 
      className={`${styles['checkbox-group']} ${className}`}
      data-touched={touched}
      data-error={error}
    >
      {options.map(option => (
        <label key={option.value} className={styles['checkbox-label']}>
          <input
            type="checkbox"
            name={name}
            value={option.value}
            checked={values.includes(option.value)}
            onChange={handleChange}
            onBlur={handleBlur}
            className={`${styles['checkbox-input']} ${error && touched ? styles['error'] : ''}`}
          />
          {option.label}
        </label>
      ))}
      {error && touched && (
        <div className={styles['form-validator-error-message']}>{error}</div>
      )}
    </div>
  );
};