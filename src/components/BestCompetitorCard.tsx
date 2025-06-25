// components/BestCompetitorCard.tsx

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Crown, ExternalLink } from "lucide-react";
import { CompetitorResult } from "@/utils/api";

interface BestCompetitorCardProps {
  competitor: CompetitorResult;
}

const BestCompetitorCard = ({ competitor }: BestCompetitorCardProps) => {
  const handleLearnMore = () => {
    if (competitor.website) {
      window.open(competitor.website, "_blank", "noopener,noreferrer");
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

      <CardContent className="space-y-4 text-sm text-gray-800">
        <div>
          <h3 className="text-lg font-semibold text-gray-900 mb-2">
            {competitor.name}
          </h3>
          <p className="text-gray-700 leading-relaxed">
            {competitor.description}
          </p>
        </div>

        <div className="space-y-1">
          {competitor.website && (
            <p>
              <strong>Website:</strong>{" "}
              <a
                href={competitor.website}
                target="_blank"
                rel="noopener noreferrer"
                className="text-blue-600 underline"
              >
                {competitor.website}
              </a>
            </p>
          )}
          {competitor.pricing_model && (
            <p>
              <strong>Pricing Model:</strong> {competitor.pricing_model}
            </p>
          )}
          {competitor.is_open_source !== undefined && (
            <p>
              <strong>Open Source:</strong>{" "}
              {competitor.is_open_source ? "✅ Yes" : "❌ No"}
            </p>
          )}
          {competitor.api_available && (
            <p>
              <strong>API:</strong> {competitor.api_available}
            </p>
          )}
          {competitor.tech_stack && competitor.tech_stack.length > 0 && (
            <p>
              <strong>Tech Stack:</strong> {competitor.tech_stack.join(", ")}
            </p>
          )}
          {competitor.language_support &&
            competitor.language_support.length > 0 && (
              <p>
                <strong>Language Support:</strong>{" "}
                {competitor.language_support.join(", ")}
              </p>
            )}
          {competitor.integration_capabilities &&
            competitor.integration_capabilities.length > 0 && (
              <p>
                <strong>Integrations:</strong>{" "}
                {competitor.integration_capabilities.join(", ")}
              </p>
            )}
        </div>

        {competitor.reason && (
          <div className="p-4 bg-white rounded-md border border-yellow-200">
            <h4 className="font-medium text-gray-900 mb-2">
              Why this is your top competitor:
            </h4>
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
