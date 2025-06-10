import React, { useEffect, useState } from "react";
import { fetchCompanies } from "../services/apiService";
import CompanyCard from "./CompanyCard";
import SortControls from "./SortControls";
import { useSortContext } from "../contexts/SortContext";

const CompanyList = () => {
  const [companies, setCompanies] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const { sortOption, filterRegion, searchTerm } = useSortContext();

  useEffect(() => {
    const getCompanies = async () => {
      try {
        setIsLoading(true);
        const data = await fetchCompanies();
        setCompanies(data);
      } catch (error) {
        console.error("Error fetching companies:", error);
      } finally {
        setIsLoading(false);
      }
    };

    getCompanies();
  }, []);

  // Filter and sort companies based on context values
  const filteredAndSortedCompanies = React.useMemo(() => {
    let result = [...companies];

    // Filter by region
    if (filterRegion !== "all") {
      result = result.filter((company) => {
        const region = company.address ? company.address.toLowerCase() : "";
        return region.includes(filterRegion.toLowerCase());
      });
    }

    // Filter by search term
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      result = result.filter(
        (company) =>
          company.fullname?.toLowerCase().includes(term) ||
          company.shortname?.toLowerCase().includes(term) ||
          company.address?.toLowerCase().includes(term)
      );
    }

    // Sort companies
    switch (sortOption) {
      case "nameAsc":
        return result.sort((a, b) => a.shortname.localeCompare(b.shortname));
      case "nameDesc":
        return result.sort((a, b) => b.shortname.localeCompare(a.shortname));
      case "availabilityAsc":
        return result.sort((a, b) => {
          const availA =
            (a.maxAcceptedStudent - a.studentAccepted) / a.maxAcceptedStudent;
          const availB =
            (b.maxAcceptedStudent - b.studentAccepted) / b.maxAcceptedStudent;
          return availA - availB;
        });
      case "availabilityDesc":
        return result.sort((a, b) => {
          const availA =
            (a.maxAcceptedStudent - a.studentAccepted) / a.maxAcceptedStudent;
          const availB =
            (b.maxAcceptedStudent - b.studentAccepted) / b.maxAcceptedStudent;
          return availB - availA;
        });
      default:
        return result;
    }
  }, [companies, sortOption, filterRegion, searchTerm]);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Internship Companies</h1>

      <SortControls />

      {isLoading ? (
        <div className="text-center py-10">
          <p className="text-xl">Loading companies...</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {filteredAndSortedCompanies.map((company) => (
            <CompanyCard key={company.id} company={company} />
          ))}
        </div>
      )}
    </div>
  );
};

export default CompanyList;
