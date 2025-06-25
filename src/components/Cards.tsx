// src/components/Cards.tsx
import React from "react";
import BestCompetitorCard from "@/components/BestCompetitorCard";
import ResultCard from "@/components/ResultCard";
import { CompetitorResult } from "@/utils/api"; // Assuming CompetitorResult is defined here

// Define the props interface for the Cards component
interface CardsProps {
  loading: boolean;
  hasSearched: boolean;
  developerRecommendations: string | null;
  results: CompetitorResult[]; // All competitors
  bestCompetitor: CompetitorResult | null;
  otherCompetitors: CompetitorResult[];
}

const Cards: React.FC<CardsProps> = ({
  loading,
  hasSearched,
  developerRecommendations,
  results,
  bestCompetitor,
  otherCompetitors,
}) => {
  if (loading) {
    return (
      <div className="text-center py-12">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-lg text-gray-600">Analyzing competitors...</p>
        <p className="text-sm text-gray-500 mt-2">
          This may take a few moments
        </p>
      </div>
    );
  }

  if (!hasSearched) {
    // If no search has been performed yet, render nothing or a welcome message
    return null;
  }

  return (
    <div className="space-y-8">
      {/* Display Developer Recommendations */}
      {developerRecommendations && (
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

      {/* Results (competitors) */}
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
                  <ResultCard key={competitor.id} competitor={competitor} />
                ))}
              </div>
            </div>
          )}
        </>
      ) : (
        // Only show "No competitors found" if a search was performed and no results
        <div className="text-center py-12">
          <div className="max-w-md mx-auto">
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              No competitors found
            </h3>
            <p className="text-gray-600 mb-4">
              Try refining your query with more specific details about your
              business or product.
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cards;
