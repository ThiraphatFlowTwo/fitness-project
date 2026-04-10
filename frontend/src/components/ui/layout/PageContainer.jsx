/**
 * PageContainer - Consistent page wrapper component
 *
 * Design: Clean container with proper spacing and background
 * Usage: Wrap all page content for consistent layout
 *
 * @param {React.ReactNode} children - Page content
 * @param {String} className - Additional classes
 */

const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`
      min-h-screen bg-gray-50
      p-4 sm:p-6 lg:p-8
      ${className}
    `}>
      <div className="max-w-7xl mx-auto">
        {children}
      </div>
    </div>
  );
};

export { PageContainer };
