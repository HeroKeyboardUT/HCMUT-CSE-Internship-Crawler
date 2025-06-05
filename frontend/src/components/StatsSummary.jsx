import React from "react";

const StatsSummary = ({ stats, regions }) => {
  return (
    <div className="bg-gray-800 rounded-lg p-4 mb-6">
      <h2 className="text-xl font-bold text-white mb-3">
        Internship Statistics
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {/* Availability stats */}
        <div className="bg-gray-700 rounded-lg p-3">
          <h3 className="text-lg font-semibold text-white mb-2">
            Availability
          </h3>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Available Companies:</span>
              <span className="text-green-400 font-medium">
                {stats.available}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Full Companies:</span>
              <span className="text-red-400 font-medium">{stats.full}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Total Companies:</span>
              <span className="text-blue-400 font-medium">{stats.total}</span>
            </div>
          </div>
        </div>

        {/* Slots stats */}
        <div className="bg-gray-700 rounded-lg p-3">
          <h3 className="text-lg font-semibold text-white mb-2">
            Internship Slots
          </h3>
          <div className="flex flex-col space-y-2">
            <div className="flex justify-between">
              <span className="text-gray-300">Available Slots:</span>
              <span className="text-green-400 font-medium">
                {stats.availableSlots}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Filled Slots:</span>
              <span className="text-yellow-400 font-medium">
                {stats.filledSlots}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-gray-300">Total Slots:</span>
              <span className="text-blue-400 font-medium">
                {stats.totalSlots}
              </span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="mt-2">
            <div className="w-full bg-gray-600 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{ width: `${stats.fillPercentage}%` }}
              ></div>
            </div>
            <div className="flex justify-between text-xs text-gray-400 mt-1">
              <span>0%</span>
              <span>{stats.fillPercentage}% filled</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        {/* Regions */}
        <div className="bg-gray-700 rounded-lg p-3">
          <h3 className="text-lg font-semibold text-white mb-2">Top Regions</h3>
          <div className="flex flex-col space-y-2">
            {Object.entries(regions)
              .sort(
                ([, companiesA], [, companiesB]) =>
                  companiesB.length - companiesA.length
              )
              .slice(0, 5)
              .map(([region, companies]) => (
                <div key={region} className="flex justify-between">
                  <span className="text-gray-300">{region}:</span>
                  <span className="text-blue-400 font-medium">
                    {companies.length}
                  </span>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default StatsSummary;
