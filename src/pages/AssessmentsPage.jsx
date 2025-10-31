import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getAllAssessments } from "../utils/api/assessments";

export default function AssessmentsPage() {
  const [allAssessments, setAllAssessments] = useState([]); // Store all assessments
  const [filteredAssessments, setFilteredAssessments] = useState([]); // Store filtered results
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [page, setPage] = useState(1);
  const [pageSize] = useState(10);
  const [total, setTotal] = useState(0);

  // Load all assessments once on component mount
  async function loadAllAssessments() {
    try {
      setLoading(true);
      setError("");
      const data = await getAllAssessments({ page: 1, pageSize: 1000 }); // Load all at once
      const assessmentsArray = Array.isArray(data.items) ? data.items : [];
      setAllAssessments(assessmentsArray);
      setFilteredAssessments(assessmentsArray);
      setTotal(assessmentsArray.length);
    } catch (err) {
      console.error("Failed to load all assessments:", err);
      setError("Failed to load assessments");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadAllAssessments();
  }, []);

  // Client-side search function
  const handleSearch = (searchTerm) => {
    if (!searchTerm.trim()) {
      // If search is empty, show all assessments
      setFilteredAssessments(allAssessments);
      setTotal(allAssessments.length);
      setPage(1);
      return;
    }

    const lowercasedSearch = searchTerm.toLowerCase().trim();
    
    const filtered = allAssessments.filter(assessment => {
      const searchableFields = [
        assessment.title || "",
        assessment.jobTitle || "",
        assessment.jobId || "",
        assessment.description || ""
      ];

      return searchableFields.some(field => 
        field.toLowerCase().includes(lowercasedSearch)
      );
    });

    setFilteredAssessments(filtered);
    setTotal(filtered.length);
    setPage(1); // Reset to first page when searching
  };

  // Handle search input change with debounce
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      handleSearch(search);
    }, 300); // 300ms debounce

    return () => clearTimeout(timeoutId);
  }, [search, allAssessments]);

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  // Calculate paginated results
  const startIndex = (page - 1) * pageSize;
  const endIndex = startIndex + pageSize;
  const paginatedAssessments = filteredAssessments.slice(startIndex, endIndex);
  const totalPages = Math.ceil(total / pageSize);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full mx-4">
          <div className="flex items-center justify-center space-x-3">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            <p className="text-gray-600">Loading assessments...</p>
          </div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="bg-white rounded-xl shadow-sm p-8 max-w-md w-full mx-4">
          <div className="text-center">
            <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-2xl">⚠️</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Error Loading Assessments</h3>
            <p className="text-red-600 mb-4">{error}</p>
            <button
              onClick={loadAllAssessments}
              className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition-colors"
            >
              Try Again
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">All Assessments</h1>
          <p className="text-gray-600">Manage and view all your assessments in one place</p>
        </div>

        {/* Search Card */}
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
          <div className="max-w-md">
            <label htmlFor="search" className="block text-sm font-medium text-gray-700 mb-2">
              Search Assessments
            </label>
            <div className="relative">
              <input
                id="search"
                type="text"
                placeholder="Search by title, job ID, or description..."
                value={search}
                onChange={handleSearchChange}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 pl-10 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <span className="text-gray-400">🔍</span>
              </div>
            </div>
            <p className="text-xs text-gray-500 mt-2">
              Searching {allAssessments.length} assessments • Found {filteredAssessments.length} results
            </p>
          </div>
        </div>

        {/* Assessments Grid */}
        {paginatedAssessments.length === 0 ? (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <span className="text-3xl">🔍</span>
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {search ? "No matching assessments found" : "No Assessments Available"}
            </h3>
            <p className="text-gray-600 mb-4">
              {search 
                ? "Try adjusting your search terms or clear the search to see all assessments" 
                : "Get started by creating your first assessment"
              }
            </p>
            {search ? (
              <button
                onClick={() => setSearch("")}
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Clear Search
              </button>
            ) : (
              <Link
                to="/assessments/new"
                className="inline-flex items-center bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors"
              >
                Create Assessment
              </Link>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
              {paginatedAssessments.map((assessment) => {
                const totalQuestions = assessment.sections?.reduce((total, section) => 
                  total + (section.questions?.length || 0), 0
                ) || 0;

                return (
                  <div
                    key={assessment.jobId}
                    className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow"
                  >
                    <div className="flex justify-between items-start mb-4">
                      <h3 className="font-semibold text-lg text-gray-900 line-clamp-2">
                        {assessment.title || assessment.jobTitle || "Untitled Assessment"}
                      </h3>
                      {totalQuestions > 0 && (
                        <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded-full font-medium">
                          {totalQuestions} Q{totalQuestions !== 1 ? 's' : ''}
                        </span>
                      )}
                    </div>
                    
                    <div className="space-y-2 mb-4">
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium mr-2">Job ID:</span>
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs">
                          {assessment.jobId}
                        </code>
                      </div>
                      <div className="flex items-center text-sm text-gray-600">
                        <span className="font-medium mr-2">Sections:</span>
                        <span>{assessment.sections?.length || 0}</span>
                      </div>
                    </div>

                    <div className="flex justify-between items-center pt-4 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        Created {new Date(assessment.createdAt || Date.now()).toLocaleDateString()}
                      </span>
                      <Link
                        to={`/assessments/${assessment.jobId}`}
                        className="inline-flex items-center text-blue-600 hover:text-blue-800 font-medium text-sm transition-colors"
                      >
                        View Details
                        <span className="ml-1">→</span>
                      </Link>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Pagination */}
            {totalPages > 1 && (
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                  <p className="text-sm text-gray-600">
                    Showing <span className="font-medium">{startIndex + 1}</span> to{" "}
                    <span className="font-medium">{Math.min(endIndex, total)}</span> of{" "}
                    <span className="font-medium">{total}</span> assessments
                    {search && <span className="ml-2 text-blue-600">(filtered)</span>}
                  </p>
                  
                  <div className="flex items-center space-x-2">
                    <button
                      disabled={page === 1}
                      onClick={() => setPage((p) => Math.max(1, p - 1))}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      ← Previous
                    </button>
                    
                    <div className="flex items-center space-x-1">
                      {Array.from({ length: totalPages }, (_, i) => i + 1)
                        .filter(p => p === 1 || p === totalPages || Math.abs(p - page) <= 1)
                        .map((pageNum, index, array) => {
                          const showEllipsis = index < array.length - 1 && array[index + 1] !== pageNum + 1;
                          return (
                            <React.Fragment key={pageNum}>
                              <button
                                onClick={() => setPage(pageNum)}
                                className={`w-10 h-10 rounded-lg text-sm font-medium transition-colors ${
                                  pageNum === page
                                    ? "bg-blue-600 text-white"
                                    : "text-gray-700 hover:bg-gray-100"
                                }`}
                              >
                                {pageNum}
                              </button>
                              {showEllipsis && (
                                <span className="px-2 text-gray-500">...</span>
                              )}
                            </React.Fragment>
                          );
                        })}
                    </div>
                    
                    <button
                      disabled={page === totalPages}
                      onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                      className="px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      Next →
                    </button>
                  </div>
                </div>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}