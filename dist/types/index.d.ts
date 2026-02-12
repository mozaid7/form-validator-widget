export interface ValidationRule {
    required?: boolean;
    email?: boolean;
    minLength?: number;
    maxLength?: number;
    pattern?: RegExp;
    custom?: (value: any) => string | undefined;
    messages?: {
        required?: string;
        email?: string;
        minLength?: string;
        maxLength?: string;
        pattern?: string;
    };
}
export interface FormValidatorProps {
    children: React.ReactNode;
    validationRules: Record<string, ValidationRule>;
    onSubmit: (data: Record<string, any>) => void;
    theme?: 'light' | 'dark' | Record<string, string>;
    customStyles?: {
        form?: React.CSSProperties;
        [key: string]: React.CSSProperties | undefined;
    };
    enableDebounce?: boolean;
    debounceDelay?: number;
}
export interface FormState {
    [key: string]: any;
}
export interface ErrorState {
    [key: string]: string;
}
export interface FormContextValue {
    values: FormState;
    errors: ErrorState;
    handleChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    handleBlur: (e: React.FocusEvent<HTMLInputElement>) => void;
}
