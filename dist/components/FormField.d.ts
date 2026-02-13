import React from "react";
interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    errors?: string;
    touched?: boolean;
}
export declare const FormField: React.FC<FormFieldProps>;
export {};
