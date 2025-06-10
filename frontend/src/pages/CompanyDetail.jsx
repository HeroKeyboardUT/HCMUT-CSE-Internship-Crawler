import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Header from "../components/Header";
import Footer from "../components/Footer";

const CompanyDetail = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const company = location.state?.company;
  const returnToPosition = location.state?.returnToPosition;

  const handleBackToList = () => {
    navigate("/");

    // If we should restore position, do it after navigation
    if (returnToPosition) {
      setTimeout(() => {
        const savedPosition = sessionStorage.getItem("scrollPosition");
        if (savedPosition) {
          window.scrollTo(0, parseInt(savedPosition));
        }
      }, 100);
    }
  };

  if (!company) {
    return (
      <div className="flex flex-col min-h-screen bg-gray-900">
        <Header />
        <main className="flex-grow container mx-auto px-4 py-8">
          <div className="bg-red-900 text-white p-6 rounded-lg text-center">
            <p className="text-xl mb-4">Company information not available</p>
            <button
              onClick={() => navigate("/")}
              className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded"
            >
              Back to Companies
            </button>
          </div>
        </main>
        <Footer />
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-gray-900">
      <Header />

      <main className="flex-grow container mx-auto px-4 py-8">
        <button
          onClick={handleBackToList}
          className="flex items-center text-blue-400 hover:text-blue-300 mb-6"
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-5 w-5 mr-1"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M10 19l-7-7m0 0l7-7m-7 7h18"
            />
          </svg>
          Back to Companies
        </button>

        <div className="bg-gray-800 rounded-lg shadow-lg border border-gray-700 overflow-hidden">
          <div className="p-6 md:p-8">
            <div className="flex flex-col md:flex-row items-center md:items-start mb-6">
              {company.image ? (
                <img
                  src={
                    company.image.startsWith("/")
                      ? `https://internship.cse.hcmut.edu.vn${company.image}`
                      : company.image
                  }
                  alt={company.shortname}
                  className="w-24 h-24 object-contain rounded bg-white p-2 mb-4 md:mb-0 md:mr-6"
                  onError={(e) => {
                    e.target.onerror = null;
                    e.target.src =
                      "https://via.placeholder.com/150?text=No+Image";
                  }}
                />
              ) : (
                <div className="w-24 h-24 bg-gray-700 rounded flex items-center justify-center mb-4 md:mb-0 md:mr-6">
                  <span className="text-gray-400 text-4xl font-bold">
                    {company.shortname?.[0] || "?"}
                  </span>
                </div>
              )}

              <div className="text-center md:text-left">
                <h1 className="text-3xl font-bold text-white mb-2">
                  {company.shortname}
                </h1>
                <h2 className="text-xl text-gray-300 mb-2">
                  {company.fullname}
                </h2>
                <div className="flex items-center justify-center md:justify-start text-gray-400 mb-2">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                  <span>{company.address}</span>
                </div>
                {company.email && (
                  <div className="flex items-center justify-center md:justify-start text-gray-400">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-5 w-5 mr-2"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth={2}
                        d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                      />
                    </svg>
                    <span>
                      {Array.isArray(company.email)
                        ? company.email.join(", ")
                        : company.email}
                    </span>
                  </div>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8 text-center">
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  Accepted Students
                </h3>
                <p className="text-3xl font-bold text-green-400">
                  {company.studentAccepted || 0}
                </p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  Maximum Students
                </h3>
                <p className="text-3xl font-bold text-yellow-400">
                  {company.maxAcceptedStudent || 0}
                </p>
              </div>
              <div className="bg-gray-700 rounded-lg p-4">
                <h3 className="text-lg font-semibold text-gray-300 mb-2">
                  Registered Students
                </h3>
                <p className="text-3xl font-bold text-blue-400">
                  {company.studentRegister || 0}
                </p>
              </div>
            </div>

            {company.description && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                  Company Description
                </h3>
                <div className="text-gray-300 prose prose-invert max-w-none">
                  <p>{company.description}</p>
                </div>
              </div>
            )}

            {company.work && (
              <div className="mb-8">
                <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                  Work Description
                </h3>
                <div className="text-gray-300 prose prose-invert max-w-none">
                  <p>{company.work}</p>
                </div>
              </div>
            )}

            {company.internshipFiles && company.internshipFiles.length > 0 && (
              <div>
                <h3 className="text-xl font-semibold text-white mb-4 border-b border-gray-700 pb-2">
                  Internship Files
                </h3>
                <ul className="space-y-2">
                  {company.internshipFiles.map((file, index) => (
                    <li key={index} className="bg-gray-700 rounded p-3">
                      <a
                        href={
                          file.url.startsWith("/")
                            ? `https://internship.cse.hcmut.edu.vn${file.url}`
                            : file.url
                        }
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center text-blue-400 hover:text-blue-300"
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-5 w-5 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
                          />
                        </svg>
                        {file.name || "Download File"}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default CompanyDetail;
