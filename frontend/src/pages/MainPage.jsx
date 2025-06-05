import React, { useEffect, useState } from "react";
import Header from "../components/Header";
import Footer from "../components/Footer";
import CompanyCard from "../components/CompanyCard";
import Pagination from "../components/Pagination";
import StatsSummary from "../components/StatsSummary";
import FilterPanel from "../components/FilterPanel";
import { fetchCompanies } from "../services/apiService";
import {
  extractRegion,
  hasAvailableSlots,
  groupByRegion,
  getAvailabilityStats,
} from "../utils/companyUtils";

const MainPage = () => {
  // State for companies data
  const [allCompanies, setAllCompanies] = useState([]);
  const [displayedCompanies, setDisplayedCompanies] = useState([]);
  const [filteredCompanies, setFilteredCompanies] = useState([]);

  // UI state
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showAllCompanies, setShowAllCompanies] = useState(false);
  const [showAdvancedFilters, setShowAdvancedFilters] = useState(false);

  // Search and pagination
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);

  // Stats and grouping
  const [companyStats, setCompanyStats] = useState({
    total: 0,
    available: 0,
    full: 0,
    totalSlots: 0,
    filledSlots: 0,
    availableSlots: 0,
    fillPercentage: 0,
  });
  const [regionGroups, setRegionGroups] = useState({});

  // Sorting and filtering
  const [sortBy, setSortBy] = useState("index");
  const [filters, setFilters] = useState({
    region: "all",
    availability: "all",
    minMaxStudents: "",
    maxMaxStudents: "",
  });

  const ITEMS_PER_PAGE = 9; // Number of companies per page

  // Handle search input with debounce
  useEffect(() => {
    const timerId = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
      setCurrentPage(1); // Reset to first page when search changes
    }, 500);

    return () => {
      clearTimeout(timerId);
    };
  }, [searchTerm]);

  // Fetch all companies
  useEffect(() => {
    const getCompanies = async () => {
      setLoading(true);
      try {
        const data = await fetchCompanies();
        setAllCompanies(data);

        // Calculate stats and group by region
        const groups = groupByRegion(data);
        setRegionGroups(groups);

        setLoading(false);
      } catch (error) {
        setError("Failed to load companies. Please try again later.", error);
        setLoading(false);
      }
    };

    getCompanies();
  }, []);

  // Apply search, filtering and sorting
  useEffect(() => {
    if (allCompanies.length > 0) {
      // First apply search term
      let filtered = allCompanies.filter((company) => {
        const searchLower = debouncedSearchTerm.toLowerCase();
        return (
          company.shortname?.toLowerCase().includes(searchLower) ||
          company.fullname?.toLowerCase().includes(searchLower) ||
          company.address?.toLowerCase().includes(searchLower)
        );
      });

      // Apply region filter
      if (filters.region !== "all") {
        filtered = filtered.filter(
          (company) => extractRegion(company.address) === filters.region
        );
      }

      // Apply availability filter
      if (filters.availability !== "all") {
        filtered = filtered.filter((company) => {
          const available = hasAvailableSlots(company);
          return filters.availability === "available" ? available : !available;
        });
      }

      // Apply min/max students filter
      if (filters.minMaxStudents !== "") {
        filtered = filtered.filter(
          (company) =>
            company.maxAcceptedStudent >= Number(filters.minMaxStudents)
        );
      }

      if (filters.maxMaxStudents !== "") {
        filtered = filtered.filter(
          (company) =>
            company.maxAcceptedStudent <= Number(filters.maxMaxStudents)
        );
      }

      // Sort companies
      const sorted = [...filtered].sort((a, b) => {
        switch (sortBy) {
          case "name":
            return a.shortname?.localeCompare(b.shortname);
          case "maxStudents":
            return b.maxAcceptedStudent - a.maxAcceptedStudent;
          case "acceptedStudents":
            return b.studentAccepted - a.studentAccepted;
          case "availableSlots":
            return (
              b.maxAcceptedStudent -
              b.studentAccepted -
              (a.maxAcceptedStudent - a.studentAccepted)
            );
          default:
            return a.index - b.index;
        }
      });

      // Update filtered companies and stats
      setFilteredCompanies(sorted);
      setCompanyStats(getAvailabilityStats(sorted));

      // Calculate total pages
      const calculatedTotalPages = Math.ceil(sorted.length / ITEMS_PER_PAGE);
      setTotalPages(calculatedTotalPages);

      // Either show all companies or paginate
      if (showAllCompanies) {
        setDisplayedCompanies(sorted);
      } else {
        // Paginate
        const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
        const paginatedCompanies = sorted.slice(
          startIndex,
          startIndex + ITEMS_PER_PAGE
        );
        setDisplayedCompanies(paginatedCompanies);
      }
    }
  }, [
    allCompanies,
    debouncedSearchTerm,
    sortBy,
    currentPage,
    showAllCompanies,
    filters,
  ]);

  const handlePageChange = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0);
  };

  const toggleDisplayMode = () => {
    setShowAllCompanies(!showAllCompanies);
    if (!showAllCompanies) {
      // When switching to show all, scroll to top
      window.scrollTo(0, 0);
    }
  };

  const handleFilterChange = (filterName, value) => {
    if (filterName === "reset") {
      setFilters({
        region: "all",
        availability: "all",
        minMaxStudents: "",
        maxMaxStudents: "",
      });
    } else {
      setFilters((prev) => ({
        ...prev,
        [filterName]: value,
      }));
    }

    // Reset to first page when filters change
    setCurrentPage(1);
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-white mb-2">
            Internship Companies
          </h1>
          <p className="text-gray-400">
            Find and explore internship opportunities from {companyStats.total}{" "}
            companies
          </p>
        </div>

        {/* Stats Summary */}
        {!loading && !error && (
          <StatsSummary stats={companyStats} regions={regionGroups} />
        )}

        {/* Search and Sort */}
        <div className="flex flex-col md:flex-row justify-between mb-6 space-y-4 md:space-y-0">
          <div className="relative w-full md:w-1/3">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <svg
                className="w-5 h-5 text-gray-400"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                ></path>
              </svg>
            </div>
            <input
              type="text"
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full pl-10 p-2.5"
              placeholder="Search companies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <div className="flex space-x-4">
            <select
              className="bg-gray-800 border border-gray-700 text-white text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-2.5"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <option value="index">Sort by Default</option>
              <option value="name">Sort by Name</option>
              <option value="maxStudents">Sort by Max Students</option>
              <option value="acceptedStudents">
                Sort by Accepted Students
              </option>
              <option value="availableSlots">Sort by Available Slots</option>
            </select>

            <button
              onClick={toggleDisplayMode}
              className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors"
            >
              {showAllCompanies ? "Show Paginated" : "Show All Companies"}
            </button>
          </div>
        </div>

        {/* Advanced Filters */}
        {!loading && !error && (
          <FilterPanel
            filters={filters}
            onFilterChange={handleFilterChange}
            regions={regionGroups}
            onToggleFilters={() => setShowAdvancedFilters(!showAdvancedFilters)}
            showFilters={showAdvancedFilters}
          />
        )}

        {/* Results count */}
        {!loading && !error && (
          <div className="mb-4 text-gray-400">
            Showing {displayedCompanies.length} of {filteredCompanies.length}{" "}
            companies
            {debouncedSearchTerm && (
              <span> matching "{debouncedSearchTerm}"</span>
            )}
          </div>
        )}

        {/* Content */}
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
          </div>
        ) : error ? (
          <div className="bg-red-900 text-white p-4 rounded-lg">
            <p>{error}</p>
          </div>
        ) : displayedCompanies.length === 0 ? (
          <div className="bg-gray-800 text-white p-8 rounded-lg text-center">
            <p className="text-xl">
              No companies found matching your search criteria.
            </p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {displayedCompanies.map((company) => (
                <CompanyCard key={company.id} company={company} />
              ))}
            </div>

            {!showAllCompanies && filteredCompanies.length > ITEMS_PER_PAGE && (
              <Pagination
                currentPage={currentPage}
                totalPages={totalPages}
                onPageChange={handlePageChange}
              />
            )}
          </>
        )}
      </main>

      <Footer />
    </div>
  );
};

export default MainPage;
