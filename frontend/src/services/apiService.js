/**
 * Service for handling API requests
 */

const BASE_URL = import.meta.env.VITE_API_URL;
// const BASE_URL = "http://localhost:3000/api";

/**
 * Fetch companies from the API
 * @returns {Promise<Array>} List of companies
 */
export const fetchCompanies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/api/crawl/hcmut`);

    if (!response.ok) {
      throw new Error(`HTTP error! Status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
};
