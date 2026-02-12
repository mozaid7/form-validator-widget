import React, {useState, useCallback} from "react";
import { FormValidatorProps, FormState, ErrorState } from "../types";
import { validateField, validateForm } from "../utils/validators";
import { useDebounce } from "../hooks/useDebounce";
import '../styles/animations.css';

export const  FormValidator: React.FC<FormValidatorProps> = ({
    children,
    validationRules,
    onSubmit,
    theme = 'light',
    customStyles = {} ,
    enableDebounce = true,
    debounceDelay = 300
}) => {
    const [formValues, setFormValues] = useState<FormState>({});
    const [errors, setErrors] = useState<ErrorState>({});
    const [touched, setTouched] = useState<Record<string, boolean>>({});

    const debouncedValidate = useDebounce((name: string, value: any) => {
        const error = validateField(value, validationRules[name]);
        setErrors(prev => ({...prev, [name]: error || ''}));
    }, debounceDelay);

    const handleChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = e.target;

        setFormValues(prev => ({...prev, [name]: value }));

        if(enableDebounce) {
            debouncedValidate(name, value);
        } else {
            const error = validateField(value, validationRules[name]);
            setErrors(prev => ({...prev, [name]: error || '' }));
        }
    }, [enableDebounce, debouncedValidate, validationRules]);

    const handleBlur = useCallback((e: React.FocusEvent<HTMLInputElement>) => {
        const { name, value } = e.target;

        setTouched(prev => ({...prev, [name]: true }));


        const error = validateField(value, validationRules[name]);
        setErrors(prev => ({ ...prev, [name]: error || '' }));
    }, [validationRules]);

    const handleSubmit = useCallback((e: React.FormEvent) => {
        e.preventDefault();

        const formErrors = validateForm(formValues, validationRules);
        setErrors(formErrors);

        if(Object.keys(formErrors).length === 0){
            onSubmit(formValues);
        }
    }, [formValues, validationRules, onSubmit]);

    const childrenWithProps = React.Children.map(children, child => {
        if (React.isValidElement(child)) {
            const element = child as React.ReactElement<{ name?: string }>;

            if(element.props.name) {
                return React.cloneElement(child, {
                    onChange: handleChange,
                    onBlur: handleBlur,
                    value: formValues[element.props.name] || '',
                    className: `form-validator-field ${errors[element.props.name] ? 'error' : ''} ${touched[element.props.name] && !errors[element.props.name] ? 'form-validator-success' : ''} `,
                    style: customStyles[element.props.name],
                    'data-theme': theme,
                    'data-touched': touched[element.props.name],
                    'data-error': !!errors[element.props.name]
                } as any);
            }
        }
        return child;
    });

    const errorElements = Object.keys(errors).map(fieldName => (
        errors[fieldName] && (
            <div key={fieldName} className="form-validator-error-message" data-field={fieldName}>
                {errors[fieldName]}
            </div>
        )
    ));

    return (
        <form 
            onSubmit={handleSubmit}
            className={`form-validator-theme-${theme}`}
            style={customStyles.form}
            noValidate
        >
            {childrenWithProps}
            {errorElements}
            <button type="submit">Submit</button>
        </form>
    );
}