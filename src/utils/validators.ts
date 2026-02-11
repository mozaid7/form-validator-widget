import { ValidationRule } from "../types";

export type ValidatorFn = (value: any) => string | undefined;

export const validateField = (
    value: any,
    rules?: ValidationRule
): string | undefined => {
    if (!rules) return undefined;

    if(rules.required){
        const message = rules.messages?.required || 'This field is required';
        if(!value || value.trim() === '') return message;
    }

    if(rules.email && value){
        const message = rules.messages?.email || 'Please enter a valid email';
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if(!emailRegex.test(value)) return message;
    }

    if(rules.minLength && value){
        const message = rules.messages?.minLength || `Must be at least ${rules.minLength} characters`;
        if(value.length < rules.minLength) return message;
    }

    if(rules.maxLength && value){
        const message = rules.messages?.maxLength || `Must be more than ${rules.maxLength} characters`;
        if(value.length > rules.maxLength) return message;
    }

    if(rules.pattern && value){
        const message = rules.messages?.pattern || 'Invalid format';
        if(!rules.pattern.test(value)) return message;
    }

    if(rules.custom){
        return rules.custom(value);
    }

    return undefined;
};

export const validateForm = (
    values: Record<string, any>,
    rules: Record<string, ValidationRule>
): Record<string, string> => {
    const errors: Record<string, string> = {};

    Object.keys(rules).forEach(fieldName => {
        const error = validateField(values[fieldName], rules[fieldName]);
        if(error) {
            errors[fieldName] = error;
        }
    });

    return errors;
};