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
export declare const CheckboxGroup: React.FC<CheckboxGroupProps>;
export {};
