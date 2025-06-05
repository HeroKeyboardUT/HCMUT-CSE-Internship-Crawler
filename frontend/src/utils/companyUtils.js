/**
 * Extracts region information from company address
 * @param {string} address Company address
 * @returns {string} Extracted region
 */
export const extractRegion = (address) => {
  if (!address) return "Unknown";

  // Common regions/cities in Vietnam
  const regions = [
    "Hồ Chí Minh",
    "Hà Nội",
    "Đà Nẵng",
    "Huế",
    "Cần Thơ",
    "Quận 1",
    "Quận 2",
    "Quận 3",
    "Quận 4",
    "Quận 5",
    "Quận 6",
    "Quận 7",
    "Quận 8",
    "Quận 9",
    "Quận 10",
    "Quận 11",
    "Quận 12",
    "Tân Bình",
    "Bình Thạnh",
    "Phú Nhuận",
    "Thủ Đức",
    "Bình Dương",
    "Đồng Nai",
    "Vũng Tàu",
  ];

  // Check if any of the regions are in the address
  for (const region of regions) {
    if (address.includes(region)) {
      return region;
    }
  }

  // Special case for "TP.HCM", "TPHCM", "TP HCM" etc.
  if (
    address.match(
      /TP\.?\s?HCM|Thành phố Hồ Chí Minh|HCMC|HCM|Ho Chi Minh City/i
    )
  ) {
    return "Hồ Chí Minh";
  }

  return "Khác";
};

/**
 * Check if a company has available slots
 * @param {object} company Company data
 * @returns {boolean} True if company has available slots
 */
export const hasAvailableSlots = (company) => {
  return company.studentAccepted < company.maxAcceptedStudent;
};

/**
 * Calculate availability percentage
 * @param {object} company Company data
 * @returns {number} Availability percentage (0-100)
 */
export const calculateAvailability = (company) => {
  if (!company.maxAcceptedStudent) return 0;
  const filled = (company.studentAccepted / company.maxAcceptedStudent) * 100;
  return Math.round(100 - filled);
};

/**
 * Group companies by region
 * @param {Array} companies List of companies
 * @returns {Object} Companies grouped by region
 */
export const groupByRegion = (companies) => {
  return companies.reduce((acc, company) => {
    const region = extractRegion(company.address);
    if (!acc[region]) {
      acc[region] = [];
    }
    acc[region].push(company);
    return acc;
  }, {});
};

/**
 * Get availability statistics
 * @param {Array} companies List of companies
 * @returns {Object} Availability statistics
 */
export const getAvailabilityStats = (companies) => {
  const total = companies.length;
  const availableCompanies = companies.filter(hasAvailableSlots);
  const available = availableCompanies.length;
  const full = total - available;

  // Calculate total slots and filled slots
  const totalSlots = companies.reduce(
    (sum, company) => sum + (company.maxAcceptedStudent || 0),
    0
  );
  const filledSlots = companies.reduce(
    (sum, company) => sum + (company.studentAccepted || 0),
    0
  );

  return {
    total,
    available,
    full,
    totalSlots,
    filledSlots,
    availableSlots: totalSlots - filledSlots,
    fillPercentage: Math.round((filledSlots / totalSlots) * 100) || 0,
  };
};
