"use client";

import { Calendar } from "lucide-react";

const PeriodSelector = ({ selectedPeriod, selectedDate, onPeriodChange }) => {
  const periods = [
    { value: "day", label: "Ngày" },
    { value: "week", label: "Tuần" },
    { value: "month", label: "Tháng" },
    { value: "year", label: "Năm" },
  ];

  return (
    <div className="flex items-center gap-4 bg-white p-4 rounded-lg shadow-sm border border-gray-200">
      <div className="flex items-center gap-2">
        <Calendar className="h-4 w-4 text-gray-500" />
        <span className="text-sm font-medium text-gray-700">Thời gian:</span>
      </div>

      <select
        value={selectedPeriod}
        onChange={(e) => onPeriodChange(e.target.value, selectedDate)}
        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        {periods.map((period) => (
          <option key={period.value} value={period.value}>
            {period.label}
          </option>
        ))}
      </select>

      <input
        type="date"
        value={selectedDate}
        onChange={(e) => onPeriodChange(selectedPeriod, e.target.value)}
        className="border border-gray-300 rounded-md px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default PeriodSelector;
