/**
 * Select - Dropdown select component
 *
 * Design: Steel grey background with navy border, sky blue focus state
 * Usage: Form dropdown selections
 *
 * @param {String} label - Select label
 * @param {String} name - Select name attribute
 * @param {String} value - Selected value
 * @param {Function} onChange - Change handler
 * @param {Array} options - Array of option objects { value, label }
 * @param {String} error - Error message
 * @param {Boolean} disabled - Disabled state
 * @param {String} className - Additional classes
 * @param {Object} ...props - Additional select props
 */

import { forwardRef } from 'react';

const Select = forwardRef(({
  label,
  name,
  value,
  onChange,
  options = [],
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
      <select
        ref={ref}
        name={name}
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`
          w-full px-4 py-3 text-sm rounded-xl
          border bg-steel-50 outline-none transition
          focus:ring-2 focus:ring-sky-500 focus:border-transparent
          ${error ? 'border-rose-400 bg-rose-50' : 'border-steel-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        {...props}
      >
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && (
        <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
});

Select.displayName = 'Select';

export { Select };