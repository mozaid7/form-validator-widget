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
  // Sync with form values when they change from outside
  useEffect(() => {
    // This effect ensures the component reacts to external value changes
    if (values) {
      // Values are already synced via props
    }
  }, [values]);

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
    // Small timeout to ensure change happens before blur
    setTimeout(() => {
      onBlur?.(name);
    }, 10);
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

// Add display name for better debugging and component detection
CheckboxGroup.displayName = 'CheckboxGroup';