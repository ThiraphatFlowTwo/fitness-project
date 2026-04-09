/**
 * TextArea - Multi-line text area component
 *
 * Design: Steel grey background with navy border, sky blue focus state
 * Usage: Form text areas, descriptions, comments
 *
 * @param {String} label - Textarea label
 * @param {String} name - Textarea name attribute
 * @param {String} placeholder - Placeholder text
 * @param {String} value - Textarea value
 * @param {Function} onChange - Change handler
 * @param {Number} rows - Number of visible rows (default: 4)
 * @param {String} error - Error message
 * @param {Boolean} disabled - Disabled state
 * @param {String} className - Additional classes
 * @param {Object} ...props - Additional textarea props
 */

import { forwardRef } from 'react';

const TextArea = forwardRef(({
  label,
  name,
  placeholder,
  value,
  onChange,
  rows = 4,
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
      <textarea
        ref={ref}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        rows={rows}
        disabled={disabled}
        className={`
          w-full px-4 py-3 text-sm rounded-xl
          border bg-steel-50 outline-none transition resize-y
          focus:ring-2 focus:ring-sky-500 focus:border-transparent
          ${error ? 'border-rose-400 bg-rose-50' : 'border-steel-300'}
          ${disabled ? 'opacity-50 cursor-not-allowed' : ''}
          ${className}
        `}
        {...props}
      />
      {error && (
        <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
});

TextArea.displayName = 'TextArea';

export { TextArea };