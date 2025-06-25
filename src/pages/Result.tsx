// src/pages/Results.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Cards from "@/components/Cards";
import { CompetitorResult, HistoryEntry } from "@/utils/api";

// Define interface for the navigation state
// interface ResultState {
//   historyEntry?: HistoryEntry; // For displaying results directly from history
// }

const ResultsPage: React.FC = () => {
  const location = useLocation();

  const [query, setQuery] = useState<string | null>(null);
  const [developerRecommendations, setDeveloperRecommendations] = useState<
    string | null
  >(null);
  const [results, setResults] = useState<CompetitorResult[]>([]);
  const [hasLoadedHistory, setHasLoadedHistory] = useState<boolean>(false); // Tracks if history has been successfully loaded

  //   useEffect(() => {
  //     const state = location.state as ResultState;

  //     if (state?.historyEntry) {
  //       const historyEntry = state.historyEntry;
  //       setQuery(historyEntry.query_text);
  //       setDeveloperRecommendations(
  //         historyEntry.developerRecommendations || null
  //       );
  //       setResults(historyEntry.results || []); // Directly set the results
  //       setHasLoadedHistory(true); // Indicate that history has been loaded
  //       console.log(
  //         "Loaded historical results for query:",
  //         historyEntry.query_text
  //       );
  //     } else {
  //       // If no historyEntry is present, clear states and indicate no history loaded
  //       setQuery(null);
  //       setDeveloperRecommendations(null);
  //       setResults([]);
  //       setHasLoadedHistory(false);
  //       console.warn(
  //         "No history entry received. Please navigate from the History page to view results."
  //       );
  //     }
  //   }, [location.state]); // Depend only on location.state

  // Derive bestCompetitor and otherCompetitors from 'results' state, similar to Query.tsx
  const bestCompetitor = results.find((competitor) => competitor.isBest);
  const otherCompetitors = results.filter((competitor) => !competitor.isBest);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        {hasLoadedHistory ? ( // Only render the Cards and header if history has been loaded
          <>
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl text-center mb-4">
              {query ? `Results for: "${query}"` : "Search Results"}
            </h1>
            <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl mx-auto">
              Reviewing analysis for:{" "}
              <strong className="text-blue-600">"{query}"</strong>
            </p>
            <Cards
              loading={false} // Always false as we are displaying loaded historical data
              hasSearched={true} // Always true as we have historical data
              developerRecommendations={developerRecommendations}
              results={results}
              bestCompetitor={bestCompetitor}
              otherCompetitors={otherCompetitors}
            />
          </>
        ) : (
          // Fallback message if no history entry is provided
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No results to display.
            </h3>
            <p className="text-gray-600 mb-4">
              Please navigate from the History page to view specific results.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ResultsPage;
