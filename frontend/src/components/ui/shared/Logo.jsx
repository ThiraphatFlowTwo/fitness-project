/**
 * Logo - Unified logo component
 *
 * Design: Navy and sky blue gradient logo with icon
 * Usage: Branding, headers, footers
 *
 * @param {String} variant - Logo variant (full, icon, text)
 * @param {String} size - Logo size (sm, md, lg)
 * @param {String} className - Additional classes
 */

import { Dumbbell } from 'lucide-react';
import { Link } from 'react-router-dom';

const Logo = ({ variant = 'full', size = 'md', className = '' }) => {
  const sizeClasses = {
    sm: {
      icon: 'w-6 h-6',
      text: 'text-sm',
    },
    md: {
      icon: 'w-10 h-10',
      text: 'text-base',
    },
    lg: {
      icon: 'w-12 h-12',
      text: 'text-lg',
    },
  };

  const currentSize = sizeClasses[size] || sizeClasses.md;

  return (
    <Link to="/" className={`
      flex items-center gap-3 group
      ${className}
    `}>
      {/* Icon */}
      <div className={`
        bg-gradient-to-br from-navy-700 to-sky-600 rounded-xl flex items-center justify-center text-white
        shadow-lg group-hover:scale-110 transition-transform duration-200
        ${currentSize.icon}
      `}>
        <Dumbbell className="w-6 h-6" />
      </div>

      {/* Text */}
      {variant !== 'icon' && (
        <div className={variant === 'text' ? 'hidden' : 'block'}>
          <span className={`font-bold ${currentSize.text} bg-gradient-to-r from-navy-600 to-sky-600 bg-clip-text text-transparent`}>
            ระบบจัดการเทรนเนอร์
          </span>
          <p className="text-xs text-steel-400">วิทยาลัยการกีฬา</p>
        </div>
      )}
    </Link>
  );
};

export default Logo;