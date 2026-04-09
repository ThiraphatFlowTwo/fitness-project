/**
 * Table - Data table component
 *
 * Design: Clean table with navy headers and steel borders
 * Usage: Data display, user lists, exercise lists
 *
 * @param {Array} columns - Array of column definitions { key, label, render }
 * @param {Array} data - Array of data objects
 * @param {Boolean} striped - Use striped row styling
 * @param {Boolean} hover - Add hover effect on rows
 * @param {String} className - Additional classes
 */

const Table = ({ columns = [], data = [], striped = true, hover = true, className = '' }) => {
  return (
    <div className={`
      bg-white rounded-xl shadow-md border border-steel-200 overflow-hidden
      ${className}
    `}>
      <div className="overflow-x-auto">
        <table className="w-full">
          {/* Table Header */}
          <thead className="bg-gradient-to-r from-navy-700 to-navy-900 text-white">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  className="px-6 py-4 text-left text-sm font-semibold uppercase tracking-wider"
                >
                  {column.label}
                </th>
              ))}
            </tr>
          </thead>

          {/* Table Body */}
          <tbody className="divide-y divide-steel-200">
            {data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                className={`
                  ${striped && rowIndex % 2 === 0 ? 'bg-steel-50/50' : 'bg-white'}
                  ${hover ? 'hover:bg-sky-50/30 transition-colors' : ''}
                `}
              >
                {columns.map((column) => (
                  <td
                    key={`${rowIndex}-${column.key}`}
                    className="px-6 py-4 text-sm text-steel-700"
                  >
                    {column.render ? column.render(row[column.key], row) : row[column.key]}
                  </td>
                ))}
              </tr>
            ))}

            {/* Empty State */}
            {data.length === 0 && (
              <tr>
                <td
                  colSpan={columns.length}
                  className="px-6 py-12 text-center text-steel-500"
                >
                  ไม่พบข้อมูล
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export { Table };