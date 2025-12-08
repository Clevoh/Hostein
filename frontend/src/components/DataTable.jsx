// src/components/DataTable.jsx
import React from "react";

export default function DataTable({ columns = [], rows = [] }) {
  return (
    <div className="bg-white rounded-xl shadow overflow-x-auto">
      <table className="w-full table-auto">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((c) => (
              <th key={c.key} className="text-left px-4 py-3 text-sm text-gray-600">
                {c.title}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i} className={i % 2 === 0 ? "bg-white" : "bg-gray-50"}>
              {columns.map((c) => (
                <td key={c.key} className="px-4 py-3 text-sm text-gray-700">
                  {c.render ? c.render(r) : r[c.key]}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
