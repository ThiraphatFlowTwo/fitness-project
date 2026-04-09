/**
 * FormField - Form field wrapper component
 *
 * Design: Consistent form field spacing and layout
 * Usage: Wraps form inputs with consistent spacing
 *
 * @param {String} label - Field label
 * @param {React.ReactNode} children - Input component
 * @param {String} error - Error message
 * @param {String} hint - Helpful hint text
 * @param {Boolean} required - Show required indicator
 * @param {String} className - Additional classes
 */

const FormField = ({ label, children, error, hint, required = false, className = '' }) => {
  return (
    <div className={`mb-4 ${className}`}>
      {label && (
        <label className="block text-xs font-semibold text-steel-600 uppercase tracking-wider mb-2">
          {label}
          {required && <span className="text-rose-500 ml-1">*</span>}
        </label>
      )}
      {children}
      {hint && !error && (
        <p className="text-xs text-steel-500 mt-1">{hint}</p>
      )}
      {error && (
        <p className="text-rose-500 text-xs mt-1.5 flex items-center gap-1">
          ⚠️ {error}
        </p>
      )}
    </div>
  );
};

export { FormField };