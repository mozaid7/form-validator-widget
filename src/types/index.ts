
export interface ValidationRule {
  
  required?: boolean;
  
  minLength?: number;
  maxLength?: number;
  pattern?: RegExp;
  
  email?: boolean;
  
  complexity?: boolean;  
  
  number?: boolean;
  min?: number;
  max?: number;
  
  url?: boolean;
  
  tel?: boolean;
  
  date?: boolean;
  minDate?: string;
  maxDate?: string;
  
  checkboxGroup?: boolean;
  minSelected?: number;
  maxSelected?: number;
  
  radioGroup?: boolean;
  
  select?: boolean;
  
  custom?: (value: any, allValues?: Record<string, any>) => string | undefined;
  
  messages?: {
    required?: string;
    
    minLength?: string;
    maxLength?: string;
    pattern?: string;
    
    email?: string;
    
    complexity?: string;
    
    number?: string;
    min?: string;
    max?: string;
    
    url?: string;
    
    tel?: string;
    
    date?: string;
    minDate?: string;
    maxDate?: string;
    
    minSelected?: string;
    maxSelected?: string;
  };
}

export interface FormValidatorProps {
  children: React.ReactNode;
  
  validationRules: Record<string, ValidationRule>;
  
  onSubmit: (data: Record<string, any>) => void;
  
  theme?: 'light' | 'dark' | Record<string, string>;
  
  customStyles?: Record<string, React.CSSProperties>;
  
  enableDebounce?: boolean;
  debounceDelay?: number;
}

export interface FormState {
  [key: string]: any;  
}

// Error state
export interface ErrorState {
  [key: string]: string;  
}

export interface FormContextValue {
  values: FormState;
  errors: ErrorState;
  handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}