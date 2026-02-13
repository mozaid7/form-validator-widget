import { __assign, __rest, __spreadArray } from 'tslib';
import React, { useRef, useCallback, useState } from 'react';

var validateField = function (value, rules, allValues) {
    var _a, _b, _c, _d, _e, _f, _g, _h, _j, _k, _l, _m, _o, _p, _q, _r, _s, _t, _u;
    if (!rules)
        return undefined;
    if (rules.required) {
        var message = ((_a = rules.messages) === null || _a === void 0 ? void 0 : _a.required) || 'This field is required';
        if (typeof value === 'boolean') {
            if (!value)
                return message;
        }
        else if (Array.isArray(value)) {
            if (value.length === 0)
                return message;
        }
        else if (value === null || value === undefined || value.toString().trim() === '') {
            return message;
        }
    }
    if (!value && !rules.required)
        return undefined;
    if (typeof value === 'string') {
        if (rules.minLength && value.length < rules.minLength) {
            return ((_b = rules.messages) === null || _b === void 0 ? void 0 : _b.minLength) || "Must be at least ".concat(rules.minLength, " characters");
        }
        if (rules.maxLength && value.length > rules.maxLength) {
            return ((_c = rules.messages) === null || _c === void 0 ? void 0 : _c.maxLength) || "Must be no more than ".concat(rules.maxLength, " characters");
        }
        if (rules.pattern && !rules.pattern.test(value)) {
            return ((_d = rules.messages) === null || _d === void 0 ? void 0 : _d.pattern) || 'Invalid format';
        }
    }
    if (rules.email && value) {
        var emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            return ((_e = rules.messages) === null || _e === void 0 ? void 0 : _e.email) || 'Please enter a valid email address';
        }
    }
    if (rules.complexity && value) {
        var message = ((_f = rules.messages) === null || _f === void 0 ? void 0 : _f.complexity) || 'Password must contain at least 1 uppercase, 1 lowercase, 1 number, and 1 special character';
        var hasUpperCase = /[A-Z]/.test(value);
        var hasLowerCase = /[a-z]/.test(value);
        var hasNumbers = /\d/.test(value);
        var hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(value);
        if (!hasUpperCase || !hasLowerCase || !hasNumbers || !hasSpecial) {
            return message;
        }
    }
    if (rules.number !== undefined) {
        var num = Number(value);
        if (isNaN(num)) {
            return ((_g = rules.messages) === null || _g === void 0 ? void 0 : _g.number) || 'Please enter a valid number';
        }
        if (rules.min !== undefined && num < rules.min) {
            return ((_h = rules.messages) === null || _h === void 0 ? void 0 : _h.min) || "Must be at least ".concat(rules.min);
        }
        if (rules.max !== undefined && num > rules.max) {
            return ((_j = rules.messages) === null || _j === void 0 ? void 0 : _j.max) || "Must be no more than ".concat(rules.max);
        }
    }
    if (rules.url && value) {
        try {
            new URL(value);
        }
        catch (_v) {
            return ((_k = rules.messages) === null || _k === void 0 ? void 0 : _k.url) || 'Please enter a valid URL (include http:// or https://)';
        }
    }
    if (rules.tel && value) {
        var phoneRegex = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,4}[-\s\.]?[0-9]{1,4}$/;
        if (!phoneRegex.test(value)) {
            return ((_l = rules.messages) === null || _l === void 0 ? void 0 : _l.tel) || 'Please enter a valid phone number';
        }
    }
    if (rules.date && value) {
        var date = new Date(value);
        if (isNaN(date.getTime())) {
            return ((_m = rules.messages) === null || _m === void 0 ? void 0 : _m.date) || 'Please enter a valid date';
        }
        if (rules.minDate) {
            var minDate = new Date(rules.minDate);
            if (date < minDate) {
                return ((_o = rules.messages) === null || _o === void 0 ? void 0 : _o.minDate) || "Date must be after ".concat(minDate.toLocaleDateString());
            }
        }
        if (rules.maxDate) {
            var maxDate = new Date(rules.maxDate);
            if (date > maxDate) {
                return ((_p = rules.messages) === null || _p === void 0 ? void 0 : _p.maxDate) || "Date must be before ".concat(maxDate.toLocaleDateString());
            }
        }
    }
    if (rules.checkboxGroup && Array.isArray(value)) {
        if (rules.required && value.length === 0) {
            return ((_q = rules.messages) === null || _q === void 0 ? void 0 : _q.required) || 'Please select at least one option';
        }
        if (rules.minSelected !== undefined && value.length < rules.minSelected) {
            return ((_r = rules.messages) === null || _r === void 0 ? void 0 : _r.minSelected) || "Please select at least ".concat(rules.minSelected, " options");
        }
        if (rules.maxSelected !== undefined && value.length > rules.maxSelected) {
            return ((_s = rules.messages) === null || _s === void 0 ? void 0 : _s.maxSelected) || "Please select no more than ".concat(rules.maxSelected, " options");
        }
    }
    if (rules.radioGroup && rules.required) {
        if (!value || value === '') {
            return ((_t = rules.messages) === null || _t === void 0 ? void 0 : _t.required) || 'Please select an option';
        }
    }
    if (rules.select && rules.required) {
        if (!value || value === '' || value === 'default' || value === 'placeholder') {
            return ((_u = rules.messages) === null || _u === void 0 ? void 0 : _u.required) || 'Please select an option';
        }
    }
    if (rules.custom) {
        return rules.custom(value, allValues);
    }
    return undefined;
};
var validateForm = function (values, rules) {
    var errors = {};
    Object.keys(rules).forEach(function (fieldName) {
        var error = validateField(values[fieldName], rules[fieldName], values);
        if (error) {
            errors[fieldName] = error;
        }
    });
    return errors;
};

function useDebounce(fn, delay) {
    var timeoutRef = useRef(undefined);
    return useCallback((function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(function () {
            fn.apply(void 0, args);
        }, delay);
    }), [fn, delay]);
}

var FormValidator = function (_a) {
    var children = _a.children, validationRules = _a.validationRules, onSubmit = _a.onSubmit, _b = _a.theme, theme = _b === void 0 ? 'light' : _b, _c = _a.customStyles, customStyles = _c === void 0 ? {} : _c, _d = _a.enableDebounce, enableDebounce = _d === void 0 ? true : _d, _e = _a.debounceDelay, debounceDelay = _e === void 0 ? 300 : _e;
    var _f = useState({}), formValues = _f[0], setFormValues = _f[1];
    var _g = useState({}), errors = _g[0], setErrors = _g[1];
    var _h = useState({}), touched = _h[0], setTouched = _h[1];
    // Only show errors for touched fields
    var getVisibleErrors = useCallback(function () {
        var visibleErrors = {};
        Object.keys(errors).forEach(function (fieldName) {
            if (touched[fieldName] && errors[fieldName]) {
                visibleErrors[fieldName] = errors[fieldName];
            }
        });
        return visibleErrors;
    }, [errors, touched]);
    var debouncedValidate = useDebounce(function (name, value) {
        var error = validateField(value, validationRules[name]);
        setErrors(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = error || '', _a)));
        });
    }, debounceDelay);
    var handleChange = useCallback(function (e) {
        var _a = e.target, name = _a.name, value = _a.value, type = _a.type, checked = _a.checked;
        // Handle different input types
        var fieldValue = value;
        if (type === 'checkbox') {
            fieldValue = checked ? value : '';
        }
        else if (type === 'radio') {
            fieldValue = value;
        }
        setFormValues(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = fieldValue, _a)));
        });
        if (enableDebounce) {
            debouncedValidate(name, fieldValue);
        }
        else {
            var error_1 = validateField(fieldValue, validationRules[name]);
            setErrors(function (prev) {
                var _a;
                return (__assign(__assign({}, prev), (_a = {}, _a[name] = error_1 || '', _a)));
            });
        }
    }, [enableDebounce, debouncedValidate, validationRules]);
    var handleBlur = useCallback(function (e) {
        var _a = e.target, name = _a.name, value = _a.value, type = _a.type, checked = _a.checked;
        var fieldValue = value;
        if (type === 'checkbox') {
            fieldValue = checked ? value : '';
        }
        else if (type === 'radio') {
            fieldValue = value;
        }
        // Mark field as touched
        setTouched(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = true, _a)));
        });
        var error = validateField(fieldValue, validationRules[name]);
        setErrors(function (prev) {
            var _a;
            return (__assign(__assign({}, prev), (_a = {}, _a[name] = error || '', _a)));
        });
    }, [validationRules]);
    var handleSubmit = useCallback(function (e) {
        e.preventDefault();
        var formErrors = validateForm(formValues, validationRules);
        setErrors(formErrors);
        // Mark ALL fields as touched on submit
        var allTouched = {};
        Object.keys(validationRules).forEach(function (fieldName) {
            allTouched[fieldName] = true;
        });
        setTouched(allTouched);
        if (Object.keys(formErrors).length === 0) {
            onSubmit(formValues);
        }
    }, [formValues, validationRules, onSubmit]);
    var childrenWithProps = React.Children.map(children, function (child) {
        if (React.isValidElement(child)) {
            var element = child;
            if (element.props.name) {
                var fieldName = element.props.name;
                var hasError = !!errors[fieldName];
                var isTouched = touched[fieldName];
                var isSuccess = isTouched && !hasError;
                // Generate className
                var className = 'form-validator-field';
                if (hasError)
                    className += ' error';
                if (isSuccess)
                    className += ' form-validator-success';
                if (element.props.className)
                    className += " ".concat(element.props.className);
                // Pass all props to the child
                var props = {
                    onChange: handleChange,
                    onBlur: handleBlur,
                    value: formValues[fieldName] || '',
                    className: className,
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
    var visibleErrors = getVisibleErrors();
    var errorElements = Object.keys(visibleErrors).map(function (fieldName) { return (React.createElement("div", { key: fieldName, className: "form-validator-error-message", "data-field": fieldName }, visibleErrors[fieldName])); });
    return (React.createElement("form", { onSubmit: handleSubmit, className: "form-validator-theme-".concat(theme), style: customStyles.form, noValidate: true },
        childrenWithProps,
        errorElements,
        React.createElement("button", { type: "submit", style: { display: 'none' } }, "Submit")));
};

var FormField = function (_a) {
    var label = _a.label, errors = _a.errors, touched = _a.touched, _b = _a.className, className = _b === void 0 ? '' : _b, id = _a.id, props = __rest(_a, ["label", "errors", "touched", "className", "id"]);
    var fieldId = id || props.name;
    return (React.createElement("div", { className: "form-validator-field-container" },
        label && (React.createElement("label", { htmlFor: fieldId, className: "form-validator-label" }, label)),
        React.createElement("input", __assign({ id: fieldId, className: "form-validator-input ".concat(errors ? 'errors' : '', " ").concat(touched && !errors ? 'success' : '', " ").concat(className), "aria-invalid": !!errors, "aria-describedby": errors ? "".concat(fieldId, "-errors") : undefined }, props)),
        errors && (React.createElement("div", { id: "".concat(fieldId, "-errors"), className: "form-validator-errors-message", role: "alert" }, errors))));
};

var CheckboxGroup = function (_a) {
    var name = _a.name, options = _a.options, _b = _a.values, values = _b === void 0 ? [] : _b, onChange = _a.onChange, onBlur = _a.onBlur, _c = _a.className, className = _c === void 0 ? '' : _c, error = _a.error, touched = _a.touched;
    var handleChange = function (e) {
        var _a = e.target, value = _a.value, checked = _a.checked;
        var newValues;
        if (checked) {
            newValues = __spreadArray(__spreadArray([], values, true), [value], false);
        }
        else {
            newValues = values.filter(function (v) { return v !== value; });
        }
        onChange === null || onChange === void 0 ? void 0 : onChange(name, newValues);
    };
    return (React.createElement("div", { className: "checkbox-group ".concat(className) },
        options.map(function (option) { return (React.createElement("label", { key: option.value, className: "checkbox-label" },
            React.createElement("input", { type: "checkbox", name: name, value: option.value, checked: values.includes(option.value), onChange: handleChange, onBlur: function () { return onBlur === null || onBlur === void 0 ? void 0 : onBlur(name); }, className: "checkbox-input ".concat(error && touched ? 'error' : '') }),
            option.label)); }),
        error && touched && (React.createElement("div", { className: "error-message" }, error))));
};

if (!Array.prototype.some) {
    Array.prototype.some = function (callback, thisArg) {
        for (var i = 0; i < this.length; i++) {
            if (callback.call(thisArg, this[i], i, this)) {
                return true;
            }
        }
        return false;
    };
}
if (!Array.prototype.every) {
    Array.prototype.every = function (callback, thisArg) {
        for (var i = 0; i < this.length; i++) {
            if (!callback.call(thisArg, this[i], i, this)) {
                return false;
            }
        }
        return true;
    };
}
if (!String.prototype.trim) {
    String.prototype.trim = function () {
        return this.replace(/^[\s\uFEFF\xA0]+|[\s\uFEFF\xA0]+$/g, '');
    };
}
var throttle = function (func, limit) {
    var inThrottle;
    var lastResult;
    return function () {
        var args = [];
        for (var _i = 0; _i < arguments.length; _i++) {
            args[_i] = arguments[_i];
        }
        if (!inThrottle) {
            inThrottle = true;
            lastResult = func.apply(this, args);
            setTimeout(function () { return inThrottle = false; }, limit);
        }
        return lastResult;
    };
};

export { CheckboxGroup, FormField, FormValidator, throttle, useDebounce, validateField, validateForm };
//# sourceMappingURL=index.esm.js.map
