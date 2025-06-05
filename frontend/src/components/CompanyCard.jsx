import React from "react";
import { useNavigate } from "react-router-dom";
import {
  calculateAvailability,
  hasAvailableSlots,
  extractRegion,
} from "../utils/companyUtils";

const CompanyCard = ({ company }) => {
  const navigate = useNavigate();

  const handleViewDetails = () => {
    navigate(`/company/${company.id}`, { state: { company } });
  };

  const isAvailable = hasAvailableSlots(company);
  const availabilityPercentage = calculateAvailability(company);
  const region = extractRegion(company.address);

  return (
    <div className="bg-gray-800 rounded-lg overflow-hidden shadow-lg hover:shadow-xl transition-shadow border border-gray-700">
      <div className="relative">
        {/* Company image */}
        <img
          src={
            company.image.startsWith("/")
              ? `https://internship.cse.hcmut.edu.vn${company.image}`
              : company.image ||
                "https://via.placeholder.com/300x150?text=No+Image"
          }
          alt={company.shortname}
          className="w-full h-48 object-cover"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "https://via.placeholder.com/300x150?text=No+Image";
          }}
        />

        {/* Availability badge */}
        <div
          className={`absolute top-2 right-2 px-2 py-1 rounded-full text-xs font-bold ${
            isAvailable ? "bg-green-500 text-white" : "bg-red-500 text-white"
          }`}
        >
          {isAvailable ? "Slots Available" : "Full"}
        </div>

        {/* Region badge */}
        <div className="absolute bottom-2 left-2 bg-blue-600 text-white text-xs px-2 py-1 rounded-full">
          {region}
        </div>
      </div>

      <div className="p-4">
        <h2 className="text-xl font-bold text-white mb-1 truncate">
          {company.shortname || "Unknown Company"}
        </h2>
        <p className="text-gray-400 text-sm h-10 overflow-hidden">
          {company.fullname || "No full name available"}
        </p>
        <p className="text-blue-500 text-sm mb-2 h-10 overflow-hidden">
          {company.address || "No address available"}
        </p>

        {/* Availability progress bar */}
        <div className="mb-3">
          <div className="flex justify-between text-xs text-gray-400 mb-1">
            <span>
              Slots: {company.studentAccepted}/{company.maxAcceptedStudent}
            </span>
            <span>{availabilityPercentage}% available</span>
          </div>
          <div className="w-full bg-gray-700 rounded-full h-2">
            <div
              className={`h-2 rounded-full ${
                availabilityPercentage > 60
                  ? "bg-green-500"
                  : availabilityPercentage > 30
                  ? "bg-yellow-500"
                  : "bg-red-500"
              }`}
              style={{ width: `${availabilityPercentage}%` }}
            ></div>
          </div>
        </div>

        {/* Company stats */}
        <div className="grid grid-cols-2 gap-2 text-sm mb-4">
          <div className="text-gray-400">
            <span className="font-bold text-white">Max: </span>
            {company.maxAcceptedStudent}
          </div>
          <div className="text-gray-400">
            <span className="font-bold text-white">Accepted: </span>
            {company.studentAccepted}
          </div>
          <div className="text-gray-400">
            <span className="font-bold text-white">Registered: </span>
            {company.studentRegister}
          </div>
          <div className="text-gray-400">
            <span className="font-bold text-white">Index: </span>
            {company.index}
          </div>
        </div>

        {/* View details button */}
        <div className="mt-4 pt-4 border-t border-gray-700">
          <button
            onClick={handleViewDetails}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded transition-colors"
          >
            View Details
          </button>
        </div>
      </div>
    </div>
  );
};

export default CompanyCard;
