// components/ResultCard.tsx

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ExternalLink } from "lucide-react";
import { CompetitorResult } from "@/utils/api"; // <-- CORRECTED: Import from api.ts

// REMOVED: The 'export interface CompetitorResult { ... }' block is removed from here.
// It is now defined and exported solely from '@/utils/api'.

interface ResultCardProps {
  competitor: CompetitorResult;
}

const ResultCard = ({ competitor }: ResultCardProps) => {
  const handleLearnMore = () => {
    if (competitor.website) {
      window.open(competitor.website, "_blank", "noopener,noreferrer");
    }
  };

  return (
    <Card
      className={`h-full transition-all duration-200 hover:shadow-md ${
        competitor.isBest
          ? "border-blue-500 bg-blue-50 ring-2 ring-blue-200"
          : "border-gray-200 hover:border-gray-300"
      }`}
    >
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <CardTitle
            className={`text-lg font-semibold ${
              competitor.isBest ? "text-blue-900" : "text-gray-900"
            }`}
          >
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
        {/* <p className="text-sm text-gray-600 leading-relaxed">
          {competitor.description}
        </p> */}

        {/* {competitor.reason && (
          <div className="p-3 bg-blue-100 rounded-md">
            <p className="text-sm text-blue-800">
              <strong>Why this is a top competitor:</strong> {competitor.reason}
            </p>
          </div>
        )} */}

        <p className="text-gray-600 leading-relaxed">
          {competitor.description}
        </p>

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

        <Button
          onClick={handleLearnMore}
          variant={competitor.isBest ? "default" : "outline"}
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
