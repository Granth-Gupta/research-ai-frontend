import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Navigation from '@/components/Navigation';
import QueryForm from '@/components/QueryForm';
import ResultCard, { CompetitorResult } from '@/components/ResultCard';
import BestCompetitorCard from '@/components/BestCompetitorCard';
import { analyzeCompetitors, saveQueryToHistory } from '@/utils/api';

const Query = () => {
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<CompetitorResult[]>([]);
  const [hasSearched, setHasSearched] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (query: string) => {
    setLoading(true);
    setResults([]);
    
    try {
      const competitors = await analyzeCompetitors(query);
      setResults(competitors);
      setHasSearched(true);
      
      // Save to history
      await saveQueryToHistory(query, competitors);
      
      toast({
        title: "Analysis complete",
        description: `Found ${competitors.length} competitors for your query.`,
      });
    } catch (error) {
      console.error('Error analyzing competitors:', error);
      toast({
        title: "Analysis failed",
        description: "There was an error analyzing competitors. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const bestCompetitor = results.find(competitor => competitor.isBest);
  const otherCompetitors = results.filter(competitor => !competitor.isBest);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Competitor Research Tool
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Discover and analyze your competition with AI-powered insights. 
              Enter your business description to get started.
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
              <p className="text-sm text-gray-500 mt-2">This may take a few moments</p>
            </div>
          )}

          {/* Results */}
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
                          <ResultCard key={competitor.id} competitor={competitor} />
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
                      Try refining your query with more specific details about your business or product.
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
