// src/pages/Query.tsx

import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import QueryForm from "@/components/QueryForm";
import ResultCard from "@/components/ResultCard"; // CompetitorResult is now imported from api.ts
import BestCompetitorCard from "@/components/BestCompetitorCard";
// IMPORT CHANGED: Import CompetitorResult and AnalysisResponse from api.ts
import {
  analyzeCompetitors,
  saveQueryToHistory,
  CompetitorResult,
  AnalysisResponse,
} from "@/utils/api";

const Query = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CompetitorResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  // NEW STATE: To store the developer recommendations received from the API
  const [developerRecommendations, setDeveloperRecommendations] = useState<
    string | null
  >(null);
  const { toast } = useToast();

  const handleSubmit = async (query: string) => {
    setLoading(true);
    setResults([]);
    setDeveloperRecommendations(null); // Clear previous recommendations when a new query is submitted
    setHasSearched(false); // Reset search status before a new search

    try {
      // MODIFIED: Destructure both 'competitors' and 'developerRecommendations'
      // from the AnalysisResponse object returned by analyzeCompetitors.
      const response: AnalysisResponse = await analyzeCompetitors(query); // Explicitly type for clarity
      setResults(response.competitors); // Set the array of competitor results
      setDeveloperRecommendations(response.developerRecommendations); // Set the developer recommendations string
      setHasSearched(true); // Indicate that a search has been performed and results are available

      // Save the query and its competitor results to history via Supabase
      await saveQueryToHistory(query, response.competitors);

      toast({
        title: "Analysis complete",
        description: `Found ${response.competitors.length} competitors for your query.`,
      });
    } catch (error) {
      console.error("Error analyzing competitors:", error);
      toast({
        title: "Analysis failed",
        description:
          "There was an error analyzing competitors. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false); // Always stop loading, regardless of success or failure
    }
  };

  // Determine the best competitor and other competitors for rendering.
  // The 'isBest' flag is set to false by default in api.ts as the API doesn't provide it directly.
  // If you want a "best" competitor, you'd need to implement logic here (e.g., first item, or based on criteria).
  const bestCompetitor = results.find((competitor) => competitor.isBest); // This will only find if `isBest` is explicitly set true.
  const otherCompetitors = results.filter((competitor) => !competitor.isBest);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header Section */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Research Tool
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Discover and analyze your tool's best alternatives with AI-powered
              insights.
            </p>
          </div>

          {/* Query Form */}
          <div className="max-w-2xl mx-auto">
            <QueryForm onSubmit={handleSubmit} loading={loading} />
          </div>

          {/* Loading State */}
          {loading && (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
              <p className="text-lg text-gray-600">Analyzing competitors...</p>
              <p className="text-sm text-gray-500 mt-2">
                This may take a few moments
              </p>
            </div>
          )}

          {/* Display Developer Recommendations (NEW SECTION) */}
          {!loading && hasSearched && developerRecommendations && (
            <div className="max-w-4xl mx-auto py-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">
                AI-Powered Developer Recommendations
              </h2>
              <div className="bg-white shadow-lg rounded-lg p-6 border border-gray-200">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {developerRecommendations}
                </p>
              </div>
            </div>
          )}

          {/* Results (existing logic, now showing data from API) */}
          {!loading && hasSearched && (
            <div className="space-y-8">
              {results.length > 0 ? (
                <>
                  {/* Best Competitor */}
                  {bestCompetitor && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Top Competitor Match
                      </h2>
                      <div className="max-w-4xl mx-auto">
                        <BestCompetitorCard competitor={bestCompetitor} />
                      </div>
                    </div>
                  )}

                  {/* Other Competitors */}
                  {otherCompetitors.length > 0 && (
                    <div>
                      <h2 className="text-2xl font-bold text-gray-900 mb-6 text-center">
                        Other Competitors ({otherCompetitors.length})
                      </h2>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {otherCompetitors.map((competitor) => (
                          // Each competitor gets a unique key for efficient rendering
                          <ResultCard
                            key={competitor.id}
                            competitor={competitor}
                          />
                        ))}
                      </div>
                    </div>
                  )}
                </>
              ) : (
                <div className="text-center py-12">
                  <div className="max-w-md mx-auto">
                    <h3 className="text-lg font-medium text-gray-900 mb-2">
                      No competitors found
                    </h3>
                    <p className="text-gray-600 mb-4">
                      Try refining your query with more specific details about
                      your business or product.
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
};

export default Query;
