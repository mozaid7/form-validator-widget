import React, { useState, useCallback } from "react";
import { FormValidatorProps, FormState, ErrorState } from "../types";
import { validateField, validateForm } from "../utils/validators";
import { useDebounce } from "../hooks/useDebounce";
import { CheckboxGroup } from "./CheckboxGroup";
import styles from "../styles/animations.module.css";

export const FormValidator: React.FC<FormValidatorProps> = ({
  children,
  validationRules,
  onSubmit,
  theme = "light",
  customStyles = {},
  enableDebounce = true,
  debounceDelay = 300,
}) => {
  const [formValues, setFormValues] = useState<FormState>({});
  const [errors, setErrors] = useState<ErrorState>({});
  const [touched, setTouched] = useState<Record<string, boolean>>({});

  const getVisibleErrors = useCallback(() => {
    const visibleErrors: ErrorState = {};
    Object.keys(errors).forEach((fieldName) => {
      if (touched[fieldName] && errors[fieldName]) {
        visibleErrors[fieldName] = errors[fieldName];
      }
    });
    return visibleErrors;
  }, [errors, touched]);

  const debouncedValidate = useDebounce((name: string, value: any) => {
    const error = validateField(value, validationRules[name]);
    setErrors((prev) => ({ ...prev, [name]: error || "" }));
  }, debounceDelay);

  const handleChange = useCallback(
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type, checked } = e.target as HTMLInputElement;

      let fieldValue: any = value;

      if (type === "checkbox") {
        fieldValue = checked; // single checkbox only
      }

      setFormValues((prev) => ({ ...prev, [name]: fieldValue }));

      if (enableDebounce) {
        debouncedValidate(name, fieldValue);
      } else {
        const error = validateField(fieldValue, validationRules[name]);
        setErrors((prev) => ({ ...prev, [name]: error || "" }));
      }
    },
    [enableDebounce, debouncedValidate, validationRules]
  );

  const handleBlur = useCallback(
    (e: React.FocusEvent<HTMLInputElement | HTMLSelectElement>) => {
      const { name, value, type, checked } = e.target as HTMLInputElement;

      let fieldValue: any = value;
      if (type === "checkbox") fieldValue = checked;

      setTouched((prev) => ({ ...prev, [name]: true }));

      const error = validateField(fieldValue, validationRules[name]);
      setErrors((prev) => ({ ...prev, [name]: error || "" }));
    },
    [validationRules]
  );

  const handleSubmit = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      const formErrors = validateForm(formValues, validationRules);
      setErrors(formErrors);

      const allTouched: Record<string, boolean> = {};
      Object.keys(validationRules).forEach(
        (fieldName) => (allTouched[fieldName] = true)
      );
      setTouched(allTouched);

      if (Object.keys(formErrors).length === 0) {
        onSubmit(formValues);
      }
    },
    [formValues, validationRules, onSubmit]
  );

  const childrenWithProps = React.Children.map(children, (child) => {
    if (!React.isValidElement(child)) return child;

    const element: any = child;
    if (!element.props.name) return child;

    const fieldName = element.props.name;
    const hasError = !!errors[fieldName];
    const isTouched = touched[fieldName];
    const isSuccess = isTouched && !hasError;

    // ⭐ SPECIAL CASE → CheckboxGroup
    if (element.type === CheckboxGroup) {
      return React.cloneElement(element, {
        values: formValues[fieldName] || [],
        onChange: (name: string, vals: string[]) => {
          setFormValues((prev) => ({ ...prev, [name]: vals }));

          const error = validateField(vals, validationRules[name]);
          setErrors((prev) => ({ ...prev, [name]: error || "" }));
        },
        onBlur: (name: string) =>
          setTouched((prev) => ({ ...prev, [name]: true })),
        error: errors[fieldName],
        touched: touched[fieldName],
      });
    }

    let className = styles["form-validator-field"];
    if (hasError) className += ` ${styles.error}`;
    if (isSuccess) className += ` ${styles["form-validator-success"]}`;
    if (element.props.className) className += ` ${element.props.className}`;

    return React.cloneElement(child, {
      onChange: handleChange,
      onBlur: handleBlur,
      value: formValues[fieldName] ?? "",
      checked:
        typeof formValues[fieldName] === "boolean"
          ? formValues[fieldName]
          : undefined,
      className,
      style: customStyles[fieldName],
      "data-theme": theme,
    });
  });

  const visibleErrors = getVisibleErrors();

  return (
    <form
      onSubmit={handleSubmit}
      className={`form-validator-theme-${theme}`}
      style={customStyles.form}
      noValidate
    >
      {childrenWithProps}

      {Object.keys(visibleErrors).length > 0 && (
        <div className={styles["error-summary"]}>
          {Object.values(visibleErrors).map((err, i) => (
            <div key={i} className={styles["form-validator-error-message"]}>
              {err}
            </div>
          ))}
        </div>
      )}
    </form>
  );
};
