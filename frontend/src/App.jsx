import React, { useState } from 'react';
import './App.css';
import AppRoutes from "./routes";

function App() {
  const [count, setCount] = useState(0);

  return (
    <div className="App">
      {/* Optional: Keep your test counter */}
      <div className="p-4">
        <h1 className="text-2xl font-bold mb-4">Vite + React</h1>

        <div className="card mb-6 p-4 bg-white shadow rounded">
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            onClick={() => setCount((count) => count + 1)}
          >
            count is {count}
          </button>

          <p className="mt-2 text-gray-600">
            Edit <code>src/App.jsx</code> and save to test HMR
          </p>
        </div>

        <p className="text-gray-500 mb-6">
          React + Vite project is running successfully.
        </p>
      </div>

      {/* Main dashboard and routing */}
      <AppRoutes />
    </div>
  );
}

export default App;
