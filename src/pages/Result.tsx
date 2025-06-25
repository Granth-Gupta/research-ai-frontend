// src/pages/Results.tsx
import React, { useEffect, useState } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation"; // From your App.tsx structure

interface ResultState {
  queryText: string;
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const [query, setQuery] = useState<string | null>(null);
  // You'd also likely have state for your actual results here:
  // const [results, setResults] = useState<any[]>([]);

  useEffect(() => {
    if (location.state) {
      const state = location.state as ResultState;
      setQuery(state.queryText);
      console.log("Query received on results page:", state.queryText);
      // Now, use state.queryText to fetch or display your results
      // Example: fetchResults(state.queryText).then(data => setResults(data));
    } else {
      console.warn("No query state received on results page.");
      // Optionally navigate back or show an error if no query is present
      // navigate('/history');
    }
  }, [location.state]); // Dependency array: re-run if location.state changes

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold leading-tight text-gray-900 mb-6">
          Search Results
        </h1>
        {query ? (
          <p className="text-lg text-gray-700 mb-4">
            Showing results for:{" "}
            <strong className="text-blue-600">"{query}"</strong>
          </p>
        ) : (
          <p className="text-lg text-red-500 mb-4">
            No query specified or invalid state.
          </p>
        )}
        {/* Render your actual search results here, e.g.: */}
        {/* {results.length > 0 ? (
          <ul>
            {results.map((result, index) => (
              <li key={index}>{result.title}</li>
            ))}
          </ul>
        ) : (
          <p>No results found for this query.</p>
        )} */}
      </main>
    </div>
  );
};

export default ResultsPage;
