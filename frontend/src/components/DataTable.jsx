// src/components/DataTable.jsx
export default function DataTable({ columns, rows }) {
  return (
    <div className="overflow-x-auto">
      <table className="w-full border-collapse">
        <thead>
          <tr className="border-b bg-gray-50">
            {columns.map((col) => (
              <th
                key={col.key}
                className="text-left py-3 px-4 text-sm font-semibold text-gray-600"
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {rows.map((row, index) => (
            <tr key={index} className="border-b hover:bg-gray-50">
              {columns.map((col) => (
                <td key={col.key} className="py-3 px-4 text-sm">
                  {col.render ? col.render(row) : row[col.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
