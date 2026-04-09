/**
 * Container - Content container component
 *
 * Design: Consistent container with max-width and centering
 * Usage: Page content wrappers
 *
 * @param {React.ReactNode} children - Container content
 * @param {String} size - Container size (sm, md, lg, xl, full)
 * @param {String} className - Additional classes
 */

const Container = ({ children, size = 'xl', className = '' }) => {
  const sizeClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-7xl',
    full: 'max-w-full',
  };

  return (
    <div className={`
      mx-auto px-4 sm:px-6 lg:px-8
      ${sizeClasses[size] || sizeClasses.xl}
      ${className}
    `}>
      {children}
    </div>
  );
};

export { Container };