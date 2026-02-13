import React, { useState, useCallback, ReactElement } from "react";
import { FormValidatorProps, FormState, ErrorState } from "../types";
import { validateField, validateForm } from "../utils/validators";
import { useDebounce } from "../hooks/useDebounce";
import styles from '../styles/animations.module.css';

export const FormValidator: React.FC<FormValidatorProps> = ({
    children,
    validationRules,
    onSubmit,
    theme = 'light',
    customStyles = {},
    enableDebounce = true,
    debounceDelay = 300
}) => {
    const [formValues, setFormValues] = useState<FormState>({});
    const [errors, setErrors] = useState<ErrorState>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    // Get visible errors (only for touched fields)
    const getVisibleErrors = useCallback(() => {
        const visibleErrors: ErrorState = {};
        Object.keys(errors).forEach(fieldName => {
            if (touched[fieldName] && errors[fieldName]) {
                visibleErrors[fieldName] = errors[fieldName];
            }
        });
        return visibleErrors;
    }, [errors, touched]);

    const debouncedValidate = useDebounce((name: string, value: any) => {
        const error = validateField(value, validationRules[name]);
        setErrors(prev => ({ ...prev, [name]: error || '' }));
    }, debounceDelay);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        
        let fieldValue = value;
        if (type === 'checkbox') {
            fieldValue = checked ? value : '';
        } else if (type === 'radio') {
            fieldValue = value;
        }
        
        setFormValues(prev => ({ ...prev, [name]: fieldValue }));

        if (enableDebounce) {
            debouncedValidate(name, fieldValue);
        } else {
            const error = validateField(fieldValue, validationRules[name]);
            setErrors(prev => ({ ...prev, [name]: error || '' }));
        }
    }, [enableDebounce, debouncedValidate, validationRules]);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value, type, checked } = e.target;
        
        let fieldValue = value;
        if (type === 'checkbox') {
            fieldValue = checked ? value : '';
        } else if (type === 'radio') {
            fieldValue = value;
        }
        
        setTouched(prev => ({ ...prev, [name]: true }));

        const error = validateField(fieldValue, validationRules[name]);
        setErrors(prev => ({ ...prev, [name]: error || '' }));
    }, [validationRules]);

    // Special handler for CheckboxGroup
    const handleGroupChange = useCallback((name: string, values: string[]) => {
        setFormValues(prev => ({ ...prev, [name]: values }));
        
        const error = validateField(values, validationRules[name]);
        setErrors(prev => ({ ...prev, [name]: error || '' }));
    }, [validationRules]);

    const handleGroupBlur = useCallback((name: string) => {
        setTouched(prev => ({ ...prev, [name]: true }));
        
        const error = validateField(formValues[name], validationRules[name]);
        setErrors(prev => ({ ...prev, [name]: error || '' }));
    }, [formValues, validationRules]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        const formErrors = validateForm(formValues, validationRules);
        setErrors(formErrors);
        
        const allTouched: Record<string, boolean> = {};
        Object.keys(validationRules).forEach(fieldName => {
            allTouched[fieldName] = true;
        });
        setTouched(allTouched);

        if (Object.keys(formErrors).length === 0) {
            onSubmit(formValues);
        }
    }, [formValues, validationRules, onSubmit]);

    // Process children and inject props
    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            const element = child as React.ReactElement<any>;
            const childName = element.props.name;

            if (childName) {
                // Check if this is a CheckboxGroup by looking at the component type
                const isCheckboxGroup = element.type === 'CheckboxGroup' || 
                    (typeof element.type === 'function' && element.type.name === 'CheckboxGroup');

                if (isCheckboxGroup) {
                    // For CheckboxGroup, pass group handlers
                    return React.cloneElement(element, {
                        values: formValues[childName] || [],
                        onChange: handleGroupChange,
                        onBlur: handleGroupBlur,
                        error: errors[childName],
                        touched: touched[childName],
                        'data-touched': touched[childName],
                        'data-error': !!errors[childName]
                    });
                } else {
                    // For regular inputs
                    const hasError = !!errors[childName];
                    const isTouched = touched[childName];
                    const isSuccess = isTouched && !hasError;
                    
                    let className = 'form-validator-field';
                    if (hasError) className += ' error';
                    if (isSuccess) className += ' form-validator-success';
                    if (element.props.className) className += ` ${element.props.className}`;

                    return React.cloneElement(element, {
                        onChange: handleChange,
                        onBlur: handleBlur,
                        value: formValues[childName] || '',
                        className,
                        style: customStyles[childName],
                        'data-theme': theme,
                        'data-touched': isTouched,
                        'data-error': hasError
                    });
                }
            }
        }
        return child;
    });

    // Only show error messages for touched fields, and place them near the field
    const errorElements = Object.keys(touched).map(fieldName => {
        if (touched[fieldName] && errors[fieldName]) {
            return (
                <div 
                    key={fieldName} 
                    className={styles['form-validator-error-message']}
                    data-field={fieldName}
                >
                    {errors[fieldName]}
                </div>
            );
        }
        return null;
    }).filter(Boolean);

    return (
        <form 
            onSubmit={handleSubmit}
            className={`form-validator-theme-${theme}`}
            style={customStyles.form}
            noValidate
        >
            {childrenWithProps}
            {/* Render errors at the bottom of the form */}
            {errorElements.length > 0 && (
                <div className={styles['error-summary']}>
                    {errorElements}
                </div>
            )}
            <button type="submit" style={{ display: 'none' }}>Submit</button>
        </form>
    );
};