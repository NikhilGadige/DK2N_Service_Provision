// components/ServiceSearch.jsx
"use client"
import React, { useState } from 'react';

const ServiceSearch = () => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const suggestions = [
    'Plumbing',
    'Electrical',
    'Cleaning',
    'Gardening',
    'Painting'
  ];

  const handleSearch = async (searchQuery) => {
    setLoading(true);
    setError(null);
    
    try {
      const response = await fetch(`/api/search-service?q=${encodeURIComponent(searchQuery)}`);
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong');
      }
      
      setResults(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
      setResults([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      handleSearch(query);
    }
  };

  const handleSuggestionClick = (suggestion) => {
    setQuery(suggestion);
    handleSearch(suggestion);
  };

  return (
    <div className="max-w-4xl mx-auto p-4">
      <form onSubmit={handleSubmit} className="mb-6">
        <div className="flex flex-col gap-4">
          <div className="flex gap-2">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search for services..."
              className="flex-1 p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              type="submit"
              disabled={loading}
              className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed`}
            >
              {loading ? 'Searching...' : 'Search'}
            </button>
          </div>

          {/* Suggestions */}
          <div className="flex flex-wrap gap-2">
            {suggestions.map((suggestion) => (
              <span
                key={suggestion}
                onClick={() => handleSuggestionClick(suggestion)}
                className="px-3 py-1 bg-gray-100 rounded-full text-sm cursor-pointer hover:bg-gray-200 transition-colors"
              >
                {suggestion}
              </span>
            ))}
          </div>
        </div>
      </form>

      {/* Error Display */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-md">
          {error}
        </div>
      )}

      {/* Results Display */}
      <div className="space-y-4">
        {results.length > 0 ? (
          results.map((result, index) => (
            <div
              key={index}
              className="flex border border-gray-200 rounded-md p-4 gap-4 hover:shadow-md transition-shadow"
            >
              <img
                src={result.profile_pic || '/default-avatar.png'}
                alt={result.provider_name}
                className="w-24 h-24 object-cover rounded-full"
              />
              <div className="flex-1">
                <h3 className="text-lg font-semibold">{result.provider_name}</h3>
                <p className="text-blue-600 font-medium">{result.service_name}</p>
                <p className="text-gray-600 mt-1">{result.bio}</p>
                <div className="mt-2 text-sm text-gray-700">
                  <p>Email: {result.email}</p>
                  <p>Phone: {result.phone}</p>
                  <p>Address: {result.address}</p>
                </div>
                <div className="mt-2 flex gap-4 font-medium">
                  <span>Price: ${result.price}</span>
                  <span>Duration: {result.duration}</span>
                </div>
              </div>
            </div>
          ))
        ) : (
          !loading && !error && (
            <p className="text-center text-gray-600">
              No services found. Try a different search.
            </p>
          )
        )}
      </div>
    </div>
  );
};

export default ServiceSearch;