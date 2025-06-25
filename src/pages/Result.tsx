// src/pages/Results.tsx
import React, { useEffect, useState, useCallback } from "react";
import { useLocation } from "react-router-dom";
import Navigation from "@/components/Navigation";
import Cards from "@/components/Cards"; // Import the Cards component
import {
  CompetitorResult,
  HistoryEntry,
  analyzeCompetitors,
} from "@/utils/api"; // Import CompetitorResult, HistoryEntry, and analyzeCompetitors
import { useToast } from "@/hooks/use-toast"; // Assuming you want toast notifications here too

// Define interface for the navigation state
interface ResultState {
  queryText?: string; // For new searches or re-fetching historical
  historyEntry?: HistoryEntry; // For displaying results directly from history
}

const ResultsPage: React.FC = () => {
  const location = useLocation();
  const { toast } = useToast();

  const [query, setQuery] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [hasSearched, setHasSearched] = useState<boolean>(false); // True if *any* results (new or historical) have been loaded
  const [developerRecommendations, setDeveloperRecommendations] = useState<
    string | null
  >(null);
  const [results, setResults] = useState<CompetitorResult[]>([]);
  const [bestCompetitor, setBestCompetitor] = useState<CompetitorResult | null>(
    null
  );
  const [otherCompetitors, setOtherCompetitors] = useState<CompetitorResult[]>(
    []
  );
  const [error, setError] = useState<string | null>(null);

  // Function to process and set competitor results from an array
  const processAndSetCompetitors = useCallback(
    (competitors: CompetitorResult[]) => {
      // Determine best and other competitors based on `isBest` flag or score
      // let topCompetitor: CompetitorResult | null = null;
      // let otherComps: CompetitorResult[] = [];

      const bestCompetitor = results.find((competitor) => competitor.isBest);
      const otherCompetitors = results.filter(
        (competitor) => !competitor.isBest
      );

      // const bestFromApi = competitors.find(comp => comp.isBest);
      // if (bestFromApi) {
      //     topCompetitor = bestFromApi;
      //     otherComps = competitors.filter(comp => comp.id !== bestFromApi.id);
      // } else if (competitors.length > 0) {
      //     // If no isBest flag, sort by score and pick the top one
      //     const sorted = [...competitors].sort((a, b) => (b.score || 0) - (a.score || 0));
      //     topCompetitor = { ...sorted[0], isBest: true }; // Mark the highest scored as best for display
      //     otherComps = sorted.slice(1);
      // }

      setResults(competitors);
      setBestCompetitor(bestCompetitor);
      setOtherCompetitors(otherCompetitors);
      setHasSearched(true); // Indicate that we have data to display
    },
    []
  );

  // Function to fetch new results from the API
  const fetchNewResults = useCallback(
    async (searchQuery: string) => {
      setLoading(true);
      setError(null);
      setDeveloperRecommendations(null);
      setBestCompetitor(null);
      setOtherCompetitors([]);
      setResults([]);
      setHasSearched(false); // Reset before new fetch

      try {
        const response = await analyzeCompetitors(searchQuery);
        setDeveloperRecommendations(response.developerRecommendations);
        processAndSetCompetitors(response.competitors);

        toast({
          title: "Analysis complete",
          description: `Found ${response.competitors.length} competitors for "${searchQuery}".`,
        });
      } catch (err) {
        console.error("Failed to fetch results for ResultsPage:", err);
        setError("Failed to load search results. Please try again.");
        toast({
          title: "Analysis failed",
          description: "There was an error loading results. Please try again.",
          variant: "destructive",
        });
        setHasSearched(false);
      } finally {
        setLoading(false);
      }
    },
    [processAndSetCompetitors, toast]
  );

  useEffect(() => {
    const state = location.state as ResultState;

    if (state?.historyEntry) {
      // Path 1: Came from History.tsx with a full history entry
      const historyEntry = state.historyEntry;
      setQuery(historyEntry.query_text);
      // Assuming developerRecommendations is part of historyEntry.results or a separate field
      // You might need to adjust how recommendations are stored in history if they aren't here.
      // For now, let's assume it's part of results with a specific ID, or adapt from your HistoryEntry structure
      const recommendationsItem = historyEntry.results?.find(
        (r) =>
          r.name === "Developer Recommendations" ||
          r.id === "recommendations-summary"
      );
      setDeveloperRecommendations(recommendationsItem?.description || null); // Adjust based on how you store it

      processAndSetCompetitors(historyEntry.results || []);
      setLoading(false); // No API loading needed here
      console.log(
        "Loaded historical results for query:",
        historyEntry.query_text
      );
    } else if (state?.queryText) {
      // Path 2: Came from Query.tsx or a direct link with just a query text
      setQuery(state.queryText);
      fetchNewResults(state.queryText); // Fetch new results
      console.log(
        "Received new query text, fetching results:",
        state.queryText
      );
    } else {
      // Path 3: Direct access to Results page without any state
      console.warn(
        "No query or history entry received on results page. Direct access?"
      );
      setHasSearched(false);
      setLoading(false);
      setError(
        "No specific query or history selected. Please go to History page or perform a new search."
      );
    }
  }, [location.state, fetchNewResults, processAndSetCompetitors]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl text-center mb-4">
          {query ? `Results for: "${query}"` : "Search Results"}
        </h1>

        {query && !loading && !error && (
          <p className="text-lg text-gray-700 mb-8 text-center max-w-2xl mx-auto">
            Reviewing analysis for:{" "}
            <strong className="text-blue-600">"{query}"</strong>
          </p>
        )}

        {/* Display Loading or Error */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-lg text-gray-600">
              {query
                ? `Loading results for "${query}"...`
                : "Loading results..."}
            </p>
          </div>
        )}

        {error && (
          <div className="text-center py-12">
            <p className="text-xl font-medium text-red-600">{error}</p>
          </div>
        )}

        {/* Render Cards component, passing all required props */}
        {/* Cards component handles displaying recommendations and competitor lists based on its props */}
        {!loading &&
          !error && ( // Only render Cards if not loading and no error
            <Cards
              loading={loading} // Pass loading prop to Cards for its internal checks/spinners
              hasSearched={hasSearched}
              developerRecommendations={developerRecommendations}
              results={results}
              bestCompetitor={bestCompetitor}
              otherCompetitors={otherCompetitors}
            />
          )}

        {/* Message if no query and no search performed - only if no error and not loading */}
        {!query && !hasSearched && !loading && !error && (
          <div className="text-center py-12">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Welcome to the Results Page!
            </h3>
            <p className="text-gray-600 mb-4">
              Please navigate from the History page or perform a new search to
              see results here.
            </p>
          </div>
        )}
      </main>
    </div>
  );
};

export default ResultsPage;
