/**
 * Input - Text input field component
 *
 * Design: Steel grey background with navy border, sky blue focus state
 * Usage: Form text inputs
 *
 * @param {String} label - Input label
 * @param {String} name - Input name attribute
 * @param {String} type - Input type (text, email, password, etc.)
 * @param {String} placeholder - Placeholder text
 * @param {String} value - Input value
 * @param {Function} onChange - Change handler
 * @param {React.ReactNode} icon - Optional icon component
 * @param {React.ReactNode} rightElement - Optional element on right side
 * @param {String} error - Error message
 * @param {Boolean} disabled - Disabled state
 * @param {String} className - Additional classes
 * @param {Object} ...props - Additional input props
 */

import { forwardRef } from 'react';

const Input = forwardRef(({
  label,
  name,
  type = 'text',
  placeholder,
  value,
  onChange,
  icon,
  rightElement,
  error,
  disabled = false,
  className = '',
  ...props
}, ref) => {
  return (
    <div className="mb-4">
      {label && (
        <label className="block text-xs font-semibold text-steel-600 uppercase tracking-wider mb-2">
          {label}
        </label>
      )}
      <div className="relative">
        {icon && (
          <span className="absolute left-4 top-1/2 -translate-y-1/2 text-steel-400">
            {icon}
          </span>
        )}
        <input
          ref={ref}
          name={name}
          type={type}
          placeholder={placeholder}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className={`
            w-full ${icon ? 'pl-11' : 'px-4'} ${rightElement ? 'pr-12' : 'pr-4'} py-3 text-sm rounded-xl
            border bg-steel-50 outline-none transition
            focus:ring-2 focus:ring-sky-500 focus:border-transparent
            ${error ? 'border-rose-400 bg-rose-50' : 'border-steel-300'}
            ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
            ${className}
          `}
          {...props}
        />
        {rightElement && (
          <div className="absolute right-4 top-1/2 -translate-y-1/2">
            {rightElement}
          </div>
        )}
      </div>
      {error && (
        <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export { Input };