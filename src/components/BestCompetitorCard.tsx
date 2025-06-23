
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Crown, ExternalLink } from 'lucide-react';
import { CompetitorResult } from './ResultCard';

interface BestCompetitorCardProps {
  competitor: CompetitorResult;
}

const BestCompetitorCard = ({ competitor }: BestCompetitorCardProps) => {
  const handleLearnMore = () => {
    if (competitor.website) {
      window.open(competitor.website, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className="border-2 border-yellow-400 bg-gradient-to-r from-yellow-50 to-orange-50 shadow-lg">
      <CardHeader className="pb-4">
        <CardTitle className="flex items-center text-xl font-bold text-gray-900">
          <Crown className="w-6 h-6 mr-3 text-yellow-600" aria-hidden="true" />
          Best Competitor Match
        </CardTitle>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {competitor.name}
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {competitor.description}
          </p>
        </div>
        
        {competitor.reason && (
          <div className="p-4 bg-white rounded-md border border-yellow-200">
            <h4 className="font-medium text-gray-900 mb-2">Why this is your top competitor:</h4>
            <p className="text-gray-700 text-sm leading-relaxed">
              {competitor.reason}
            </p>
          </div>
        )}
        
        <Button
          onClick={handleLearnMore}
          className="w-full sm:w-auto bg-yellow-600 hover:bg-yellow-700 text-white"
          disabled={!competitor.website}
        >
          <ExternalLink className="w-4 h-4 mr-2" aria-hidden="true" />
          Learn More About This Competitor
        </Button>
      </CardContent>
    </Card>
  );
};

export default BestCompetitorCard;
