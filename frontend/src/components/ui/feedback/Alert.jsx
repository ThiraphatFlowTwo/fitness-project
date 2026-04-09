/**
 * Alert - Alert message component
 *
 * Design: Color-coded alert with icon
 * Usage: Notifications, warnings, errors, success messages
 *
 * @param {React.ReactNode} children - Alert content
 * @param {String} variant - Alert type (success, warning, error, info)
 * @param {Boolean} dismissible - Show dismiss button
 * @param {Function} onDismiss - Dismiss handler
 * @param {String} className - Additional classes
 */

import { CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

const Alert = ({ children, variant = 'info', dismissible = false, onDismiss, className = '' }) => {
  const variantConfig = {
    success: {
      container: 'bg-emerald-50 border-emerald-200 text-emerald-900',
      icon: CheckCircle,
      iconClass: 'text-emerald-600',
    },
    warning: {
      container: 'bg-amber-50 border-amber-200 text-amber-900',
      icon: AlertTriangle,
      iconClass: 'text-amber-600',
    },
    error: {
      container: 'bg-rose-50 border-rose-200 text-rose-900',
      icon: AlertCircle,
      iconClass: 'text-rose-600',
    },
    info: {
      container: 'bg-sky-50 border-sky-200 text-sky-900',
      icon: Info,
      iconClass: 'text-sky-600',
    },
  };

  const config = variantConfig[variant] || variantConfig.info;
  const Icon = config.icon;

  return (
    <div className={`
      flex items-start gap-3 p-4 rounded-lg border
      ${config.container}
      ${className}
    `}>
      <Icon className={`w-5 h-5 flex-shrink-0 ${config.iconClass}`} />
      <div className="flex-1">
        {children}
      </div>
      {dismissible && (
        <button
          onClick={onDismiss}
          className="flex-shrink-0 text-steel-400 hover:text-steel-600 transition-colors"
        >
          ×
        </button>
      )}
    </div>
  );
};

export { Alert };