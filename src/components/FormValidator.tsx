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

    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            const element = child as React.ReactElement<Record<string, any>>;

            if (element.props.name) {
                const fieldName = element.props.name;
                const hasError = !!errors[fieldName];
                const isTouched = touched[fieldName];
                const isSuccess = isTouched && !hasError;
                
                let className = 'form-validator-field';
                if (hasError) className += ' error';
                if (isSuccess) className += ' form-validator-success';
                if (element.props.className) className += ` ${element.props.className}`;

                const props: any = {
                    onChange: handleChange,
                    onBlur: handleBlur,
                    value: formValues[fieldName] || '',
                    className,
                    style: customStyles[fieldName],
                    'data-theme': theme,
                    'data-touched': isTouched,
                    'data-error': hasError
                };

                return React.cloneElement(child, props);
            }
        }
        return child;
    });

    const visibleErrors = getVisibleErrors();
    const errorElements = Object.keys(visibleErrors).length > 0 && (
    <div className={styles['error-summary']}>
        {Object.keys(visibleErrors).map(fieldName => (
        <div 
            key={fieldName} 
            className={styles['form-validator-error-message']}
            data-field={fieldName}
        >
            {visibleErrors[fieldName]}
        </div>
        ))}
    </div>
    );

    return (
        <form 
            onSubmit={handleSubmit}
            className={`form-validator-theme-${theme}`}
            style={customStyles.form}
            noValidate
        >
            {childrenWithProps}
            {errorElements}
            <button type="submit" style={{ display: 'none' }}>Submit</button>
        </form>
    );
};