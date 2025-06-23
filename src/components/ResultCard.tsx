
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ExternalLink } from 'lucide-react';

export interface CompetitorResult {
  id: string;
  name: string;
  description: string;
  website?: string;
  reason?: string;
  isBest?: boolean;
}

interface ResultCardProps {
  competitor: CompetitorResult;
}

const ResultCard = ({ competitor }: ResultCardProps) => {
  const handleLearnMore = () => {
    if (competitor.website) {
      window.open(competitor.website, '_blank', 'noopener,noreferrer');
    }
  };

  return (
    <Card className={`h-full transition-all duration-200 hover:shadow-md ${
      competitor.isBest 
        ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200' 
        : 'border-gray-200 hover:border-gray-300'
    }`}>
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle className={`text-lg font-semibold ${
            competitor.isBest ? 'text-blue-900' : 'text-gray-900'
          }`}>
            {competitor.name}
            {competitor.isBest && (
              <span className="ml-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                Best Match
              </span>
            )}
          </CardTitle>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-4">
        <p className="text-sm text-gray-600 leading-relaxed">
          {competitor.description}
        </p>
        
        {competitor.reason && (
          <div className="p-3 bg-blue-100 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Why this is a top competitor:</strong> {competitor.reason}
            </p>
          </div>
        )}
        
        <Button
          onClick={handleLearnMore}
          variant={competitor.isBest ? 'default' : 'outline'}
          size="sm"
          className="w-full"
          disabled={!competitor.website}
        >
          <ExternalLink className="w-4 h-4 mr-2" aria-hidden="true" />
          Learn More
        </Button>
      </CardContent>
    </Card>
  );
};

export default ResultCard;
