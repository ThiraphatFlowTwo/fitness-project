/**
 * Avatar - User avatar component
 *
 * Design: Circular avatar with gradient background or image
 * Usage: User profiles, team members, avatars
 *
 * @param {String} src - Image source URL
 * @param {String} alt - Alt text for image
 * @param {String|React.ReactNode} fallback - Fallback content (letter, icon) when no image
 * @param {String} name - User name for fallback initials
 * @param {String} size - Avatar size (sm, md, lg, xl)
 * @param {Boolean} showStatus - Show online status indicator
 * @param {String} status - Status color (online, offline, busy)
 * @param {String} className - Additional classes
 */

const Avatar = ({
  src,
  alt,
  fallback,
  name,
  size = 'md',
  showStatus = false,
  status = 'offline',
  className = ''
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8 text-sm',
    md: 'w-10 h-10 text-base',
    lg: 'w-12 h-12 text-lg',
    xl: 'w-16 h-16 text-xl',
  };

  const statusColors = {
    online: 'bg-emerald-500',
    offline: 'bg-steel-400',
    busy: 'bg-rose-500',
  };

  // Get initials from name if no fallback provided
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`relative inline-flex items-center justify-center ${className}`}>
      {/* Avatar */}
      <div className={`
        ${sizeClasses[size] || sizeClasses.md}
        rounded-full flex items-center justify-center font-bold
        bg-gradient-to-br from-navy-700 to-sky-600
        text-white shadow-md
      `}>
        {src ? (
          <img
            src={src}
            alt={alt || name}
            className="w-full h-full rounded-full object-cover"
          />
        ) : (
          <span className={sizeClasses[size]}>
            {fallback || getInitials(name)}
          </span>
        )}
      </div>

      {/* Status Indicator */}
      {showStatus && (
        <div className={`
          absolute bottom-0 right-0 w-3 h-3 rounded-full border-2 border-white
          ${statusColors[status] || statusColors.offline}
        `} />
      )}
    </div>
  );
};

export { Avatar };