import React from "react";

interface FormFieldProps extends React.InputHTMLAttributes<HTMLInputElement>{
    label?: string;
    errors?: string;
    touched?: boolean;
}

export const FormField: React.FC<FormFieldProps> = ({
    label,
    errors,
    touched,
    className ='',
    id,
    ...props
}) => {
    const fieldId = id || props.name;

    return (
        <div className="form-validator-field-container">
            {label && (
                <label htmlFor={fieldId} className="form-validator-label">
                    {label}
                </label>
            )}

            <input id={fieldId} className={`form-validator-input ${errors ? 'errors' : ''} ${touched && !errors ? 'success' : ''} ${className}`}
            aria-invalid={!!errors}
            aria-describedby={errors ? `${fieldId}-errors` : undefined}
            {...props}/>

            {errors && (
                <div 
                    id={`${fieldId}-errors`}
                    className="form-validator-errors-message"
                    role="alert"
                >
                    {errors}
                </div>
            )}
        </div>
    );
};