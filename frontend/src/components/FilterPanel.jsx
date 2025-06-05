import React from "react";

const FilterPanel = ({
  filters,
  onFilterChange,
  regions,
  onToggleFilters,
  showFilters,
}) => {
  return (
    <div className="mb-6">
      <button
        onClick={onToggleFilters}
        className="bg-gray-700 text-white px-4 py-2 rounded-lg mb-2 hover:bg-gray-600 transition-colors"
      >
        {showFilters ? "Hide Advanced Filters" : "Show Advanced Filters"}
      </button>

      {showFilters && (
        <div className="bg-gray-800 rounded-lg p-4 mt-2">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {/* Region filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Region
              </label>
              <select
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={filters.region}
                onChange={(e) => onFilterChange("region", e.target.value)}
              >
                <option value="all">All Regions</option>
                {Object.keys(regions)
                  .sort()
                  .map((region) => (
                    <option key={region} value={region}>
                      {region} ({regions[region].length})
                    </option>
                  ))}
              </select>
            </div>

            {/* Availability filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Availability
              </label>
              <select
                className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                value={filters.availability}
                onChange={(e) => onFilterChange("availability", e.target.value)}
              >
                <option value="all">All Companies</option>
                <option value="available">Available Slots</option>
                <option value="full">Full (No Slots)</option>
              </select>
            </div>

            {/* Min/Max students filter */}
            <div>
              <label className="block text-sm font-medium text-gray-300 mb-2">
                Max Students Capacity
              </label>
              <div className="flex space-x-2">
                <input
                  type="number"
                  placeholder="Min"
                  className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={filters.minMaxStudents}
                  onChange={(e) =>
                    onFilterChange("minMaxStudents", e.target.value)
                  }
                  min="0"
                />
                <input
                  type="number"
                  placeholder="Max"
                  className="bg-gray-700 border border-gray-600 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5"
                  value={filters.maxMaxStudents}
                  onChange={(e) =>
                    onFilterChange("maxMaxStudents", e.target.value)
                  }
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Reset filters button */}
          <div className="mt-4 flex justify-end">
            <button
              onClick={() => onFilterChange("reset")}
              className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              Reset Filters
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FilterPanel;
