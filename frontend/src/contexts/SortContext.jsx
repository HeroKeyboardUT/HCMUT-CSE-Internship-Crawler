import React, { createContext, useContext, useState, useEffect } from "react";

const SortContext = createContext();

export const SortProvider = ({ children }) => {
  // Sort and search state
  const [sortOption, setSortOption] = useState("default");
  const [searchTerm, setSearchTerm] = useState("");

  // Filter state
  const [filterRegion, setFilterRegion] = useState("all");
  const [filterAvailability, setFilterAvailability] = useState("all");
  const [minMaxStudents, setMinMaxStudents] = useState("");
  const [maxMaxStudents, setMaxMaxStudents] = useState("");

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const [showAllCompanies, setShowAllCompanies] = useState(false);

  // Load saved state from sessionStorage on initial render
  useEffect(() => {
    const savedSortOption = sessionStorage.getItem("sortOption");
    const savedSearchTerm = sessionStorage.getItem("searchTerm");
    const savedFilterRegion = sessionStorage.getItem("filterRegion");
    const savedFilterAvailability =
      sessionStorage.getItem("filterAvailability");
    const savedMinMaxStudents = sessionStorage.getItem("minMaxStudents");
    const savedMaxMaxStudents = sessionStorage.getItem("maxMaxStudents");
    const savedCurrentPage = sessionStorage.getItem("currentPage");
    const savedShowAllCompanies = sessionStorage.getItem("showAllCompanies");

    if (savedSortOption) setSortOption(savedSortOption);
    if (savedSearchTerm) setSearchTerm(savedSearchTerm);
    if (savedFilterRegion) setFilterRegion(savedFilterRegion);
    if (savedFilterAvailability) setFilterAvailability(savedFilterAvailability);
    if (savedMinMaxStudents) setMinMaxStudents(savedMinMaxStudents);
    if (savedMaxMaxStudents) setMaxMaxStudents(savedMaxMaxStudents);
    if (savedCurrentPage) setCurrentPage(parseInt(savedCurrentPage, 10));
    if (savedShowAllCompanies)
      setShowAllCompanies(savedShowAllCompanies === "true");
  }, []);

  // Save state to sessionStorage whenever it changes
  useEffect(() => {
    sessionStorage.setItem("sortOption", sortOption);
    sessionStorage.setItem("searchTerm", searchTerm);
    sessionStorage.setItem("filterRegion", filterRegion);
    sessionStorage.setItem("filterAvailability", filterAvailability);
    sessionStorage.setItem("minMaxStudents", minMaxStudents);
    sessionStorage.setItem("maxMaxStudents", maxMaxStudents);
    sessionStorage.setItem("currentPage", String(currentPage));
    sessionStorage.setItem("showAllCompanies", String(showAllCompanies));

    // Also save scroll position when state changes
    sessionStorage.setItem("scrollPosition", window.pageYOffset);
  }, [
    sortOption,
    searchTerm,
    filterRegion,
    filterAvailability,
    minMaxStudents,
    maxMaxStudents,
    currentPage,
    showAllCompanies,
  ]);

  // Sort methods
  const updateSortOption = (option) => {
    setSortOption(option);
  };

  // Filter methods
  const updateFilterRegion = (region) => {
    setFilterRegion(region);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const updateFilterAvailability = (availability) => {
    setFilterAvailability(availability);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const updateMinMaxStudents = (value) => {
    setMinMaxStudents(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  const updateMaxMaxStudents = (value) => {
    setMaxMaxStudents(value);
    setCurrentPage(1); // Reset to first page when filter changes
  };

  // Search methods
  const updateSearchTerm = (term) => {
    setSearchTerm(term);
    setCurrentPage(1); // Reset to first page when search changes
  };

  // Pagination methods
  const updateCurrentPage = (page) => {
    setCurrentPage(page);
    window.scrollTo(0, 0); // Scroll to top when changing pages
  };

  const toggleShowAllCompanies = () => {
    setShowAllCompanies((prev) => !prev);
    window.scrollTo(0, 0); // Scroll to top when toggling view
  };

  // Reset all filters
  const resetFilters = () => {
    setFilterRegion("all");
    setFilterAvailability("all");
    setMinMaxStudents("");
    setMaxMaxStudents("");
    setCurrentPage(1);
  };

  // Get all filters as a single object (for components that need the full filter state)
  const getAllFilters = () => {
    return {
      region: filterRegion,
      availability: filterAvailability,
      minMaxStudents: minMaxStudents,
      maxMaxStudents: maxMaxStudents,
    };
  };

  return (
    <SortContext.Provider
      value={{
        // Sort and search
        sortOption,
        searchTerm,

        // Filters
        filterRegion,
        filterAvailability,
        minMaxStudents,
        maxMaxStudents,
        getAllFilters,

        // Pagination
        currentPage,
        showAllCompanies,

        // Update methods
        updateSortOption,
        updateSearchTerm,
        updateFilterRegion,
        updateFilterAvailability,
        updateMinMaxStudents,
        updateMaxMaxStudents,
        updateCurrentPage,
        toggleShowAllCompanies,
        resetFilters,
      }}
    >
      {children}
    </SortContext.Provider>
  );
};

export const useSortContext = () => useContext(SortContext);
