import React from "react";
import { useSortContext } from "../contexts/SortContext";

const SortControls = () => {
  const {
    sortOption,
    filterRegion,
    searchTerm,
    updateSortOption,
    updateFilterRegion,
    updateSearchTerm,
  } = useSortContext();

  return (
    <div className="mb-6 p-4 bg-gray-800 rounded-lg">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Sort dropdown */}
        <div>
          <label
            htmlFor="sort"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Sort by
          </label>
          <select
            id="sort"
            value={sortOption}
            onChange={(e) => updateSortOption(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2"
          >
            <option value="default">Default</option>
            <option value="nameAsc">Name (A-Z)</option>
            <option value="nameDesc">Name (Z-A)</option>
            <option value="availabilityAsc">Availability (Low-High)</option>
            <option value="availabilityDesc">Availability (High-Low)</option>
          </select>
        </div>

        {/* Region filter */}
        <div>
          <label
            htmlFor="region"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Filter by Region
          </label>
          <select
            id="region"
            value={filterRegion}
            onChange={(e) => updateFilterRegion(e.target.value)}
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2"
          >
            <option value="all">All Regions</option>
            <option value="HCM">Ho Chi Minh City</option>
            <option value="Ha Noi">Ha Noi</option>
            <option value="Da Nang">Da Nang</option>
          </select>
        </div>

        {/* Search input */}
        <div>
          <label
            htmlFor="search"
            className="block text-sm font-medium text-gray-300 mb-1"
          >
            Search Company
          </label>
          <input
            id="search"
            type="text"
            value={searchTerm}
            onChange={(e) => updateSearchTerm(e.target.value)}
            placeholder="Search by name or address..."
            className="w-full bg-gray-700 border border-gray-600 text-white rounded-lg p-2"
          />
        </div>
      </div>
    </div>
  );
};

export default SortControls;
