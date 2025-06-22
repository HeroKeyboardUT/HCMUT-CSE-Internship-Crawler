/**
 * Service for handling API requests
 */

const BASE_URL =
  import.meta.env.MODE === "production" ? "http://localhost:5001/api" : "/api";
// const BASE_URL = "http://localhost:5001/api";

/**
 * Fetch companies from the API
 * @returns {Promise<Array>} List of companies
 */
export const fetchCompanies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/crawl/hcmut`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
};
