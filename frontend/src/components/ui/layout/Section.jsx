/**
 * Section - Section wrapper component
 *
 * Design: Consistent section spacing and layout
 * Usage: Page sections with consistent padding
 *
 * @param {React.ReactNode} children - Section content
 * @param {String} title - Section title
 * @param {React.ReactNode} subtitle - Section subtitle
 * @param {String} padding - Section padding (none, sm, md, lg)
 * @param {String} className - Additional classes
 */

const Section = ({ children, title, subtitle, padding = 'lg', className = '' }) => {
  const paddingClasses = {
    none: 'py-0',
    sm: 'py-4',
    md: 'py-8',
    lg: 'py-16',
  };

  return (
    <section className={`
      ${paddingClasses[padding] || paddingClasses.lg}
      ${className}
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {(title || subtitle) && (
          <div className="mb-8">
            {title && (
              <h2 className="text-3xl font-bold bg-gradient-to-r from-navy-600 to-sky-600 bg-clip-text text-transparent mb-2">
                {title}
              </h2>
            )}
            {subtitle && (
              <p className="text-steel-600 text-lg">{subtitle}</p>
            )}
          </div>
        )}
        {children}
      </div>
    </section>
  );
};

export { Section };