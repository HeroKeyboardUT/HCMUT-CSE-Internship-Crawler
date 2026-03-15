/**
 * Service for handling API requests
 */

const BASE_URL =
  import.meta.env.MODE === "production" ? "/api" : "http://localhost:5001/api";

/**
 * Fetch companies from the API
 * @returns {Promise<{companies: Array, lastCrawledAt: number}>} Crawl data and metadata
 */
export const fetchCompanies = async () => {
  try {
    const response = await fetch(`${BASE_URL}/crawl/hcmut`);

    if (!response.ok) {
      let message = `HTTP error! Status: ${response.status}`;

      try {
        const errorBody = await response.json();
        if (errorBody?.message) {
          message = errorBody.message;
        }
      } catch {
        // Ignore JSON parse errors and keep default HTTP message.
      }

      throw new Error(message);
    }

    const payload = await response.json();

    // Backward compatibility if backend returns array directly.
    if (Array.isArray(payload)) {
      return {
        companies: payload,
        lastCrawledAt: 0,
      };
    }

    return {
      companies: Array.isArray(payload?.companies) ? payload.companies : [],
      lastCrawledAt: Number(payload?.lastCrawledAt) || 0,
    };
  } catch (error) {
    console.error("Error fetching companies:", error);
    throw error;
  }
};
