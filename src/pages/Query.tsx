// src/pages/Query.tsx
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";
import Navigation from "@/components/Navigation";
import QueryForm from "@/components/QueryForm";
// Import the new Cards component
import Cards from "@/components/Cards"; // <--- NEW IMPORT
// IMPORT CHANGED: Import CompetitorResult and AnalysisResponse from api.ts
import {
  analyzeCompetitors,
  saveQueryToHistory,
  CompetitorResult, // Keep this import as it's used for state
  AnalysisResponse,
} from "@/utils/api";

const Query = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CompetitorResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const [developerRecommendations, setDeveloperRecommendations] = useState<
    string | null
  >(null);
  const { toast } = useToast();

  const handleSubmit = async (query: string) => {
    setLoading(true);
    setResults([]);
    setDeveloperRecommendations(null);
    setHasSearched(false);

    try {
      const response: AnalysisResponse = await analyzeCompetitors(query);
      setResults(response.competitors);
      setDeveloperRecommendations(response.developerRecommendations);
      setHasSearched(true);

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
      setLoading(false);
    }
  };

  const bestCompetitor = results.find((competitor) => competitor.isBest);
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

          {/* Render Cards component, passing all required props */}
          <Cards // <--- NEW COMPONENT USAGE
            loading={loading}
            hasSearched={hasSearched}
            developerRecommendations={developerRecommendations}
            results={results}
            bestCompetitor={bestCompetitor}
            otherCompetitors={otherCompetitors}
          />
        </div>
      </main>
    </div>
  );
};

export default Query;
