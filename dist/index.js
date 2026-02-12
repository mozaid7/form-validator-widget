'use strict';

var tslib = require('tslib');
var React = require('react');

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
    var timeoutRef = React.useRef(undefined);
    return React.useCallback((function () {
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

function styleInject(css, ref) {
  if ( ref === void 0 ) ref = {};
  var insertAt = ref.insertAt;

  if (!css || typeof document === 'undefined') { return; }

  var head = document.head || document.getElementsByTagName('head')[0];
  var style = document.createElement('style');
  style.type = 'text/css';

  if (insertAt === 'top') {
    if (head.firstChild) {
      head.insertBefore(style, head.firstChild);
    } else {
      head.appendChild(style);
    }
  } else {
    head.appendChild(style);
  }

  if (style.styleSheet) {
    style.styleSheet.cssText = css;
  } else {
    style.appendChild(document.createTextNode(css));
  }
}

var css_248z = "@keyframes animations-module_shake__qVr3b{0%,to{transform:translateX(0)}10%,30%,50%,70%,90%{transform:translateX(-5px)}20%,40%,60%,80%{transform:translateX(5px)}}@keyframes animations-module_slideIn__lwqyK{0%{opacity:0;transform:translateY(-10px)}to{opacity:1;transform:translateY(0)}}@keyframes animations-module_gentlePulse__xvUHG{0%{box-shadow:0 0 0 0 rgba(59,130,246,.5)}70%{box-shadow:0 0 0 5px rgba(59,130,246,0)}to{box-shadow:0 0 0 0 rgba(59,130,246,0)}}.animations-module_form-validator-field__pirKM{transition:border-color .2s ease,box-shadow .2s ease}.animations-module_form-validator-field__pirKM:focus{animation:animations-module_gentlePulse__xvUHG 1.5s infinite;border-color:#3b82f6;outline:none}.animations-module_form-validator-field__pirKM.animations-module_error__Vq-ZO{animation:animations-module_shake__qVr3b .5s cubic-bezier(.36,.07,.19,.97) both;border-color:#ef4444}.animations-module_form-validator-error-message__h1Ge-{animation:animations-module_slideIn__lwqyK .2s ease-out;color:#ef4444;font-size:.875rem;margin-top:.25rem}.animations-module_form-validator-theme-dark__ySqnh .animations-module_form-validator-field__pirKM{background-color:#1f2937;border-color:#4b5563;color:#fff}.animations-module_form-validator-success__JkYav{background-image:url(\"data:image/svg+xml;charset=utf-8,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 24 24' fill='none' stroke='%2310b981' stroke-width='2'%3E%3Cpath d='M20 6 9 17l-5-5'/%3E%3C/svg%3E\");background-position:right .5rem center;background-repeat:no-repeat;border-color:#10b981!important;padding-right:2rem}.animations-module_form-validator-field-container__9P7zl{margin-bottom:1rem}.animations-module_form-validator-label__O7u2s{color:#374151;display:block;font-size:.875rem;font-weight:500;margin-bottom:.25rem}.animations-module_form-validator-theme-dark__ySqnh .animations-module_form-validator-label__O7u2s{color:#e5e7eb}.animations-module_checkbox-group__nmUwv{border:1px solid #e5e7eb;border-radius:.375rem;display:flex;flex-direction:column;gap:.75rem;margin-bottom:1rem;padding:.5rem}.animations-module_checkbox-label__XD-M1{align-items:center;color:#374151;cursor:pointer;display:flex;font-size:.95rem;gap:.75rem;transition:color .2s ease}.animations-module_checkbox-label__XD-M1:hover{color:#1f2937}.animations-module_checkbox-input__hRJLO{border:2px solid #d1d5db;border-radius:.25rem;cursor:pointer;height:1.2rem;transition:all .2s ease;width:1.2rem}.animations-module_checkbox-input__hRJLO:checked{background-color:#3b82f6;border-color:#3b82f6}.animations-module_checkbox-input__hRJLO.animations-module_error__Vq-ZO{animation:animations-module_pulse__JOYAq 1s infinite;border-color:#ef4444}.animations-module_checkbox-input__hRJLO:focus{ring:2px solid #3b82f6;ring-offset:2px;outline:none}.animations-module_form-validator-theme-dark__ySqnh .animations-module_checkbox-label__XD-M1{color:#e5e7eb}.animations-module_form-validator-theme-dark__ySqnh .animations-module_checkbox-group__nmUwv{border-color:#4b5563}\n/*# sourceMappingURL=data:application/json;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImFuaW1hdGlvbnMubW9kdWxlLmNzcyJdLCJuYW1lcyI6W10sIm1hcHBpbmdzIjoiQUFDQSwwQ0FDRSxNQUFXLHVCQUEwQixDQUNyQyxvQkFBMEIsMEJBQTZCLENBQ3ZELGdCQUFxQix5QkFBNEIsQ0FDbkQsQ0FFQSw0Q0FDRSxHQUNFLFNBQVUsQ0FDViwyQkFDRixDQUNBLEdBQ0UsU0FBVSxDQUNWLHVCQUNGLENBQ0YsQ0FFQSxnREFDRSxHQUFLLHNDQUE2QyxDQUNsRCxJQUFNLHVDQUE2QyxDQUNuRCxHQUFPLHFDQUEyQyxDQUNwRCxDQUVBLCtDQUNFLG9EQUNGLENBRUEscURBR0UsNERBQW9DLENBRHBDLG9CQUFxQixDQURyQixZQUdGLENBRUEsOEVBRUUsK0VBQStELENBRC9ELG9CQUVGLENBRUEsdURBSUUsdURBQWdDLENBSGhDLGFBQWMsQ0FDZCxpQkFBbUIsQ0FDbkIsaUJBRUYsQ0FFQSxtR0FDRSx3QkFBeUIsQ0FDekIsb0JBQXFCLENBQ3JCLFVBQ0YsQ0FFQSxpREFFRSx5T0FBa1AsQ0FFbFAsc0NBQXdDLENBRHhDLDJCQUE0QixDQUY1Qiw4QkFBZ0MsQ0FJaEMsa0JBQ0YsQ0FFQSx5REFDRSxrQkFDRixDQUVBLCtDQUtFLGFBQWMsQ0FKZCxhQUFjLENBRWQsaUJBQW1CLENBQ25CLGVBQWdCLENBRmhCLG9CQUlGLENBRUEsbUdBQ0UsYUFDRixDQU1BLHlDQU1FLHdCQUF5QixDQUN6QixxQkFBdUIsQ0FOdkIsWUFBYSxDQUNiLHFCQUFzQixDQUN0QixVQUFZLENBQ1osa0JBQW1CLENBQ25CLGFBR0YsQ0FFQSx5Q0FFRSxrQkFBbUIsQ0FJbkIsYUFBYyxDQUZkLGNBQWUsQ0FIZixZQUFhLENBSWIsZ0JBQWtCLENBRmxCLFVBQVksQ0FJWix5QkFDRixDQUVBLCtDQUNFLGFBQ0YsQ0FFQSx5Q0FJRSx3QkFBeUIsQ0FDekIsb0JBQXNCLENBRnRCLGNBQWUsQ0FEZixhQUFjLENBSWQsdUJBQXlCLENBTHpCLFlBTUYsQ0FFQSxpREFDRSx3QkFBeUIsQ0FDekIsb0JBQ0YsQ0FFQSx3RUFFRSxvREFBNEIsQ0FENUIsb0JBRUYsQ0FFQSwrQ0FFRSxzQkFBdUIsQ0FDdkIsZUFBZ0IsQ0FGaEIsWUFHRixDQUVBLDZGQUNFLGFBQ0YsQ0FFQSw2RkFDRSxvQkFDRiIsImZpbGUiOiJhbmltYXRpb25zLm1vZHVsZS5jc3MiLCJzb3VyY2VzQ29udGVudCI6WyJcclxuQGtleWZyYW1lcyBzaGFrZSB7XHJcbiAgMCUsIDEwMCUgeyB0cmFuc2Zvcm06IHRyYW5zbGF0ZVgoMCk7IH1cclxuICAxMCUsIDMwJSwgNTAlLCA3MCUsIDkwJSB7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCgtNXB4KTsgfVxyXG4gIDIwJSwgNDAlLCA2MCUsIDgwJSB7IHRyYW5zZm9ybTogdHJhbnNsYXRlWCg1cHgpOyB9XHJcbn1cclxuXHJcbkBrZXlmcmFtZXMgc2xpZGVJbiB7XHJcbiAgZnJvbSB7XHJcbiAgICBvcGFjaXR5OiAwO1xyXG4gICAgdHJhbnNmb3JtOiB0cmFuc2xhdGVZKC0xMHB4KTtcclxuICB9XHJcbiAgdG8ge1xyXG4gICAgb3BhY2l0eTogMTtcclxuICAgIHRyYW5zZm9ybTogdHJhbnNsYXRlWSgwKTtcclxuICB9XHJcbn1cclxuXHJcbkBrZXlmcmFtZXMgZ2VudGxlUHVsc2Uge1xyXG4gIDAlIHsgYm94LXNoYWRvdzogMCAwIDAgMCByZ2JhKDU5LCAxMzAsIDI0NiwgMC41KTsgfVxyXG4gIDcwJSB7IGJveC1zaGFkb3c6IDAgMCAwIDVweCByZ2JhKDU5LCAxMzAsIDI0NiwgMCk7IH1cclxuICAxMDAlIHsgYm94LXNoYWRvdzogMCAwIDAgMCByZ2JhKDU5LCAxMzAsIDI0NiwgMCk7IH1cclxufVxyXG5cclxuLmZvcm0tdmFsaWRhdG9yLWZpZWxkIHtcclxuICB0cmFuc2l0aW9uOiBib3JkZXItY29sb3IgMC4ycyBlYXNlLCBib3gtc2hhZG93IDAuMnMgZWFzZTtcclxufVxyXG5cclxuLmZvcm0tdmFsaWRhdG9yLWZpZWxkOmZvY3VzIHtcclxuICBvdXRsaW5lOiBub25lO1xyXG4gIGJvcmRlci1jb2xvcjogIzNiODJmNjtcclxuICBhbmltYXRpb246IGdlbnRsZVB1bHNlIDEuNXMgaW5maW5pdGU7XHJcbn1cclxuXHJcbi5mb3JtLXZhbGlkYXRvci1maWVsZC5lcnJvciB7XHJcbiAgYm9yZGVyLWNvbG9yOiAjZWY0NDQ0O1xyXG4gIGFuaW1hdGlvbjogc2hha2UgMC41cyBjdWJpYy1iZXppZXIoMC4zNiwgMC4wNywgMC4xOSwgMC45NykgYm90aDtcclxufVxyXG5cclxuLmZvcm0tdmFsaWRhdG9yLWVycm9yLW1lc3NhZ2Uge1xyXG4gIGNvbG9yOiAjZWY0NDQ0O1xyXG4gIGZvbnQtc2l6ZTogMC44NzVyZW07XHJcbiAgbWFyZ2luLXRvcDogMC4yNXJlbTtcclxuICBhbmltYXRpb246IHNsaWRlSW4gMC4ycyBlYXNlLW91dDtcclxufVxyXG5cclxuLmZvcm0tdmFsaWRhdG9yLXRoZW1lLWRhcmsgLmZvcm0tdmFsaWRhdG9yLWZpZWxkIHtcclxuICBiYWNrZ3JvdW5kLWNvbG9yOiAjMWYyOTM3O1xyXG4gIGJvcmRlci1jb2xvcjogIzRiNTU2MztcclxuICBjb2xvcjogd2hpdGU7XHJcbn1cclxuXHJcbi5mb3JtLXZhbGlkYXRvci1zdWNjZXNzIHtcclxuICBib3JkZXItY29sb3I6ICMxMGI5ODEgIWltcG9ydGFudDtcclxuICBiYWNrZ3JvdW5kLWltYWdlOiB1cmwoXCJkYXRhOmltYWdlL3N2Zyt4bWwsJTNDc3ZnIHhtbG5zPSdodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2Zycgd2lkdGg9JzE2JyBoZWlnaHQ9JzE2JyB2aWV3Qm94PScwIDAgMjQgMjQnIGZpbGw9J25vbmUnIHN0cm9rZT0nJTIzMTBiOTgxJyBzdHJva2Utd2lkdGg9JzInJTNFJTNDcG9seWxpbmUgcG9pbnRzPScyMCA2IDkgMTcgNCAxMiclM0UlM0MvcG9seWxpbmUlM0UlM0Mvc3ZnJTNFXCIpO1xyXG4gIGJhY2tncm91bmQtcmVwZWF0OiBuby1yZXBlYXQ7XHJcbiAgYmFja2dyb3VuZC1wb3NpdGlvbjogcmlnaHQgMC41cmVtIGNlbnRlcjtcclxuICBwYWRkaW5nLXJpZ2h0OiAycmVtO1xyXG59XHJcblxyXG4uZm9ybS12YWxpZGF0b3ItZmllbGQtY29udGFpbmVyIHtcclxuICBtYXJnaW4tYm90dG9tOiAxcmVtO1xyXG59XHJcblxyXG4uZm9ybS12YWxpZGF0b3ItbGFiZWwge1xyXG4gIGRpc3BsYXk6IGJsb2NrO1xyXG4gIG1hcmdpbi1ib3R0b206IDAuMjVyZW07XHJcbiAgZm9udC1zaXplOiAwLjg3NXJlbTtcclxuICBmb250LXdlaWdodDogNTAwO1xyXG4gIGNvbG9yOiAjMzc0MTUxO1xyXG59XHJcblxyXG4uZm9ybS12YWxpZGF0b3ItdGhlbWUtZGFyayAuZm9ybS12YWxpZGF0b3ItbGFiZWwge1xyXG4gIGNvbG9yOiAjZTVlN2ViO1xyXG59XHJcblxyXG4uZm9ybS12YWxpZGF0b3ItaW5wdXQge1xyXG4gIGNvbXBvc2VzOiBmb3JtLXZhbGlkYXRvci1maWVsZDtcclxufVxyXG5cclxuLmNoZWNrYm94LWdyb3VwIHtcclxuICBkaXNwbGF5OiBmbGV4O1xyXG4gIGZsZXgtZGlyZWN0aW9uOiBjb2x1bW47XHJcbiAgZ2FwOiAwLjc1cmVtO1xyXG4gIG1hcmdpbi1ib3R0b206IDFyZW07XHJcbiAgcGFkZGluZzogMC41cmVtO1xyXG4gIGJvcmRlcjogMXB4IHNvbGlkICNlNWU3ZWI7XHJcbiAgYm9yZGVyLXJhZGl1czogMC4zNzVyZW07XHJcbn1cclxuXHJcbi5jaGVja2JveC1sYWJlbCB7XHJcbiAgZGlzcGxheTogZmxleDtcclxuICBhbGlnbi1pdGVtczogY2VudGVyO1xyXG4gIGdhcDogMC43NXJlbTtcclxuICBjdXJzb3I6IHBvaW50ZXI7XHJcbiAgZm9udC1zaXplOiAwLjk1cmVtO1xyXG4gIGNvbG9yOiAjMzc0MTUxO1xyXG4gIHRyYW5zaXRpb246IGNvbG9yIDAuMnMgZWFzZTtcclxufVxyXG5cclxuLmNoZWNrYm94LWxhYmVsOmhvdmVyIHtcclxuICBjb2xvcjogIzFmMjkzNztcclxufVxyXG5cclxuLmNoZWNrYm94LWlucHV0IHtcclxuICB3aWR0aDogMS4ycmVtO1xyXG4gIGhlaWdodDogMS4ycmVtO1xyXG4gIGN1cnNvcjogcG9pbnRlcjtcclxuICBib3JkZXI6IDJweCBzb2xpZCAjZDFkNWRiO1xyXG4gIGJvcmRlci1yYWRpdXM6IDAuMjVyZW07XHJcbiAgdHJhbnNpdGlvbjogYWxsIDAuMnMgZWFzZTtcclxufVxyXG5cclxuLmNoZWNrYm94LWlucHV0OmNoZWNrZWQge1xyXG4gIGJhY2tncm91bmQtY29sb3I6ICMzYjgyZjY7XHJcbiAgYm9yZGVyLWNvbG9yOiAjM2I4MmY2O1xyXG59XHJcblxyXG4uY2hlY2tib3gtaW5wdXQuZXJyb3Ige1xyXG4gIGJvcmRlci1jb2xvcjogI2VmNDQ0NDtcclxuICBhbmltYXRpb246IHB1bHNlIDFzIGluZmluaXRlO1xyXG59XHJcblxyXG4uY2hlY2tib3gtaW5wdXQ6Zm9jdXMge1xyXG4gIG91dGxpbmU6IG5vbmU7XHJcbiAgcmluZzogMnB4IHNvbGlkICMzYjgyZjY7XHJcbiAgcmluZy1vZmZzZXQ6IDJweDtcclxufVxyXG5cclxuLmZvcm0tdmFsaWRhdG9yLXRoZW1lLWRhcmsgLmNoZWNrYm94LWxhYmVsIHtcclxuICBjb2xvcjogI2U1ZTdlYjtcclxufVxyXG5cclxuLmZvcm0tdmFsaWRhdG9yLXRoZW1lLWRhcmsgLmNoZWNrYm94LWdyb3VwIHtcclxuICBib3JkZXItY29sb3I6ICM0YjU1NjM7XHJcbn0iXX0= */";
styleInject(css_248z);

var FormValidator = function (_a) {
    var children = _a.children, validationRules = _a.validationRules, onSubmit = _a.onSubmit, _b = _a.theme, theme = _b === void 0 ? 'light' : _b, _c = _a.customStyles, customStyles = _c === void 0 ? {} : _c, _d = _a.enableDebounce, enableDebounce = _d === void 0 ? true : _d, _e = _a.debounceDelay, debounceDelay = _e === void 0 ? 300 : _e;
    var _f = React.useState({}), formValues = _f[0], setFormValues = _f[1];
    var _g = React.useState({}), errors = _g[0], setErrors = _g[1];
    var _h = React.useState({}), touched = _h[0], setTouched = _h[1];
    var getVisibleErrors = React.useCallback(function () {
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
            return (tslib.__assign(tslib.__assign({}, prev), (_a = {}, _a[name] = error || '', _a)));
        });
    }, debounceDelay);
    var handleChange = React.useCallback(function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setFormValues(function (prev) {
            var _a;
            return (tslib.__assign(tslib.__assign({}, prev), (_a = {}, _a[name] = value, _a)));
        });
        if (enableDebounce) {
            debouncedValidate(name, value);
        }
        else {
            var error_1 = validateField(value, validationRules[name]);
            setErrors(function (prev) {
                var _a;
                return (tslib.__assign(tslib.__assign({}, prev), (_a = {}, _a[name] = error_1 || '', _a)));
            });
        }
    }, [enableDebounce, debouncedValidate, validationRules]);
    var handleBlur = React.useCallback(function (e) {
        var _a = e.target, name = _a.name, value = _a.value;
        setTouched(function (prev) {
            var _a;
            return (tslib.__assign(tslib.__assign({}, prev), (_a = {}, _a[name] = true, _a)));
        });
        var error = validateField(value, validationRules[name]);
        setErrors(function (prev) {
            var _a;
            return (tslib.__assign(tslib.__assign({}, prev), (_a = {}, _a[name] = error || '', _a)));
        });
    }, [validationRules]);
    var handleSubmit = React.useCallback(function (e) {
        e.preventDefault();
        var formErrors = validateForm(formValues, validationRules);
        setErrors(formErrors);
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
                return React.cloneElement(child, {
                    onChange: handleChange,
                    onBlur: handleBlur,
                    value: formValues[element.props.name] || '',
                    className: "form-validator-field ".concat(errors[element.props.name] ? 'error' : '', " ").concat(touched[element.props.name] && !errors[element.props.name] ? 'form-validator-success' : '', " "),
                    style: customStyles[element.props.name],
                    'data-theme': theme,
                    'data-touched': touched[element.props.name],
                    'data-error': !!errors[element.props.name]
                });
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
    var label = _a.label, errors = _a.errors, touched = _a.touched, _b = _a.className, className = _b === void 0 ? '' : _b, id = _a.id, props = tslib.__rest(_a, ["label", "errors", "touched", "className", "id"]);
    var fieldId = id || props.name;
    return (React.createElement("div", { className: "form-validator-field-container" },
        label && (React.createElement("label", { htmlFor: fieldId, className: "form-validator-label" }, label)),
        React.createElement("input", tslib.__assign({ id: fieldId, className: "form-validator-input ".concat(errors ? 'errors' : '', " ").concat(touched && !errors ? 'success' : '', " ").concat(className), "aria-invalid": !!errors, "aria-describedby": errors ? "".concat(fieldId, "-errors") : undefined }, props)),
        errors && (React.createElement("div", { id: "".concat(fieldId, "-errors"), className: "form-validator-errors-message", role: "alert" }, errors))));
};

var CheckboxGroup = function (_a) {
    var name = _a.name, options = _a.options, _b = _a.values, values = _b === void 0 ? [] : _b, onChange = _a.onChange, onBlur = _a.onBlur, _c = _a.className, className = _c === void 0 ? '' : _c, error = _a.error, touched = _a.touched;
    var handleChange = function (e) {
        var _a = e.target, value = _a.value, checked = _a.checked;
        var newValues;
        if (checked) {
            newValues = tslib.__spreadArray(tslib.__spreadArray([], values, true), [value], false);
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

exports.CheckboxGroup = CheckboxGroup;
exports.FormField = FormField;
exports.FormValidator = FormValidator;
exports.throttle = throttle;
exports.useDebounce = useDebounce;
exports.validateField = validateField;
exports.validateForm = validateForm;
//# sourceMappingURL=index.js.map
