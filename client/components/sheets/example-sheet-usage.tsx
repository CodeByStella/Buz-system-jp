/**
 * EXAMPLE: How to use the HyperFormula Data Management System
 * 
 * This file demonstrates the correct way to integrate with the
 * data management system for spreadsheet-like functionality.
 * 
 * Copy this pattern to your sheet components.
 */

"use client";

import { useDataContext } from "@/lib/contexts/DataContext";
import { getCellValue, formatCellValue } from "@/lib/utils/cellHelpers";

export default function ExampleSheetUsage() {
  // Access the data context
  const { data, onChange, onSave, saving, hasChanges } = useDataContext();

  // Get data for this sheet
  const sheetName = "start"; // Change to your sheet name
  const sheetData = data[sheetName] || [];

  // Helper function to get cell value safely
  const getCell = (cellRef: string): number => {
    const value = getCellValue(sheetData, cellRef);
    return typeof value === "number" ? value : 0;
  };

  // Helper function to update cell value
  const updateCell = (cellRef: string, value: number) => {
    onChange(sheetName, cellRef, value);
  };

  return (
    <div className="p-6 space-y-6">
      <h1 className="text-2xl font-bold">Example Sheet Integration</h1>

      {/* Example 1: Single Cell Input */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Example 1: Single Cell</h2>
        <div className="flex items-center gap-4">
          <label className="w-32">Cell B6:</label>
          <input
            type="number"
            value={getCell("B6")}
            onChange={(e) => updateCell("B6", Number(e.target.value))}
            className="border rounded px-3 py-2 w-32"
          />
          <span className="text-sm text-gray-500">
            Formatted: {formatCellValue(getCell("B6"))}
          </span>
        </div>
      </div>

      {/* Example 2: Multiple Cells in a Table */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Example 2: Data Table</h2>
        <table className="border-collapse border border-gray-300">
          <thead>
            <tr>
              <th className="border border-gray-300 px-4 py-2">Cell</th>
              <th className="border border-gray-300 px-4 py-2">Value</th>
              <th className="border border-gray-300 px-4 py-2">Formatted</th>
            </tr>
          </thead>
          <tbody>
            {["B6", "B7", "B8", "B9"].map((cellRef) => (
              <tr key={cellRef}>
                <td className="border border-gray-300 px-4 py-2 font-mono">
                  {cellRef}
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  <input
                    type="number"
                    value={getCell(cellRef)}
                    onChange={(e) => updateCell(cellRef, Number(e.target.value))}
                    className="border rounded px-2 py-1 w-full"
                  />
                </td>
                <td className="border border-gray-300 px-4 py-2">
                  {formatCellValue(getCell(cellRef))}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Example 3: Calculated Field (Read-Only) */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Example 3: Calculated Field</h2>
        <div className="flex items-center gap-4">
          <label className="w-32">Total (B10):</label>
          <div className="border rounded px-3 py-2 w-32 bg-gray-100">
            {formatCellValue(getCell("B10"))}
          </div>
          <span className="text-sm text-gray-500">
            (This is calculated by HyperFormula - read-only)
          </span>
        </div>
      </div>

      {/* Example 4: Save Button */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Example 4: Save Changes</h2>
        <div className="flex items-center gap-4">
          <button
            onClick={onSave}
            disabled={!hasChanges || saving}
            className={`px-4 py-2 rounded-md text-sm font-medium transition-colors ${
              !hasChanges || saving
                ? "bg-gray-300 text-gray-500 cursor-not-allowed"
                : "bg-blue-600 text-white hover:bg-blue-700"
            }`}
          >
            {saving ? "Saving..." : "Save Changes"}
          </button>
          {hasChanges && (
            <span className="text-sm text-orange-600">
              You have unsaved changes
            </span>
          )}
          {!hasChanges && (
            <span className="text-sm text-green-600">All changes saved</span>
          )}
        </div>
      </div>

      {/* Example 5: Array Access (Advanced) */}
      <div className="space-y-2">
        <h2 className="text-lg font-semibold">Example 5: Direct Array Access</h2>
        <div className="text-sm text-gray-600 space-y-1">
          <p>You can also access cells using array indices:</p>
          <pre className="bg-gray-100 p-2 rounded">
            {`// Cell B6 is at row 5, column 1 (0-based)
const value = sheetData[5]?.[1] ?? 0;

// Update using onChange
onChange("${sheetName}", "B6", newValue);`}
          </pre>
          <p>
            Current value at [5][1]:{" "}
            <strong>{sheetData[5]?.[1] ?? "undefined"}</strong>
          </p>
        </div>
      </div>

      {/* Developer Notes */}
      <div className="border-t pt-6 space-y-2">
        <h2 className="text-lg font-semibold">Developer Notes</h2>
        <ul className="list-disc list-inside space-y-1 text-sm text-gray-600">
          <li>
            Use <code>getCellValue()</code> for safe cell access
          </li>
          <li>
            Use <code>onChange()</code> to update cell values
          </li>
          <li>
            HyperFormula automatically recalculates dependent cells
          </li>
          <li>
            Only changed values are sent to the backend on save
          </li>
          <li>
            Formula cells are read-only (cannot be edited by users)
          </li>
          <li>
            See <code>HYPERFORMULA_DATA_MANAGEMENT.md</code> for full
            documentation
          </li>
        </ul>
      </div>
    </div>
  );
}

