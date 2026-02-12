import { ValidationRule } from '../types';
export type ValidatorFn = (value: any) => string | undefined;
export declare const validateField: (value: any, rules?: ValidationRule, allValues?: Record<string, any>) => string | undefined;
export declare const validateForm: (values: Record<string, any>, rules: Record<string, ValidationRule>) => Record<string, string>;
