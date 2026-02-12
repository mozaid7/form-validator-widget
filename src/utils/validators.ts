import { ValidationRule } from '../types';

export type ValidatorFn = (value: any) => string | undefined;

export const validateField = (
  value: any, 
  rules?: ValidationRule,
  allValues?: Record<string, any>
): string | undefined => {
  if (!rules) return undefined;

  if (rules.required) {
    const message = rules.messages?.required || 'This field is required';
    
    if (typeof value === 'boolean') {
      if (!value) return message; 
    } else if (Array.isArray(value)) {
      if (value.length === 0) return message; 
    } else if (value === null || value === undefined || value.toString().trim() === '') {
      return message;
    }
  }

  if (!value && !rules.required) return undefined;

  if (typeof value === 'string') {
    
    if (rules.minLength && value.length < rules.minLength) {
      return rules.messages?.minLength || `Must be at least ${rules.minLength} characters`;
    }

    if (rules.maxLength && value.length > rules.maxLength) {
      return rules.messages?.maxLength || `Must be no more than ${rules.maxLength} characters`;
    }

    if (rules.pattern && !rules.pattern.test(value)) {
      return rules.messages?.pattern || 'Invalid format';
    }
  }

  if (rules.email && value) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return rules.messages?.email || 'Please enter a valid email address';
    }
  }

  if (rules.complexity && value) {
    const message = rules.messages?.complexity || 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character';
    
    const hasUpperCase = /[A-Z]/.test(value);
    const hasLowerCase = /[a-z]/.test(value);
    const hasNumbers = /\d/.test(value);
    const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
    
    if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecial) {
      return message;
    }
  }

  if (rules.number !== undefined) {
    const num = Number(value);
    
    if (isNaN(num)) {
      return rules.messages?.number || 'Please enter a valid number';
    }
    
    if (rules.min !== undefined && num < rules.min) {
      return rules.messages?.min || `Must be at least ${rules.min}`;
    }
    
    if (rules.max !== undefined && num > rules.max) {
      return rules.messages?.max || `Must be no more than ${rules.max}`;
    }
  }

  if (rules.url && value) {
    try {
      new URL(value);
    } catch {
      return rules.messages?.url || 'Please enter a valid URL (include http:// or https://)';
    }
  }

  if (rules.tel && value) {
    const phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,4}$/;
    if (!phoneRegex.test(value)) {
      return rules.messages?.tel || 'Please enter a valid phone number';
    }
  }

  if (rules.date && value) {
    const date = new Date(value);
    if (isNaN(date.getTime())) {
      return rules.messages?.date || 'Please enter a valid date';
    }
    
    if (rules.minDate) {
      const minDate = new Date(rules.minDate);
      if (date < minDate) {
        return rules.messages?.minDate || `Date must be after ${minDate.toLocaleDateString()}`;
      }
    }
    
    if (rules.maxDate) {
      const maxDate = new Date(rules.maxDate);
      if (date > maxDate) {
        return rules.messages?.maxDate || `Date must be before ${maxDate.toLocaleDateString()}`;
      }
    }
  }

  if (rules.checkboxGroup && Array.isArray(value)) {
    if (rules.required && value.length === 0) {
      return rules.messages?.required || 'Please select at least one option';
    }
    
    if (rules.minSelected !== undefined && value.length < rules.minSelected) {
      return rules.messages?.minSelected || `Please select at least ${rules.minSelected} options`;
    }
    
    if (rules.maxSelected !== undefined && value.length > rules.maxSelected) {
      return rules.messages?.maxSelected || `Please select no more than ${rules.maxSelected} options`;
    }
  }

  if (rules.radioGroup && rules.required) {
    if (!value || value === '') {
      return rules.messages?.required || 'Please select an option';
    }
  }

  if (rules.select && rules.required) {
    if (!value || value === '' || value === 'default' || value === 'placeholder') {
      return rules.messages?.required || 'Please select an option';
    }
  }

  if (rules.custom) {
    return rules.custom(value, allValues);
  }

  return undefined;
};

export const validateForm = (
  values: Record<string, any>,
  rules: Record<string, ValidationRule>
): Record<string, string> => {
  const errors: Record<string, string> = {};
  
  Object.keys(rules).forEach(fieldName => {
    const error = validateField(values[fieldName], rules[fieldName], values);
    if (error) {
      errors[fieldName] = error;
    }
  });
  
  return errors;
};