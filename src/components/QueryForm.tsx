import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Loader2 } from "lucide-react";

interface QueryFormProps {
  onSubmit: (query: string) => void;
  loading: boolean;
}

const QueryForm = ({ onSubmit, loading }: QueryFormProps) => {
  const [query, setQuery] = useState("");
  const [error, setError] = useState("");
  const maxLength = 200;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!query.trim()) {
      setError("Please enter a query to analyze competitors");
      return;
    }

    if (query.length > maxLength) {
      setError(`Query must be ${maxLength} characters or less`);
      return;
    }

    setError("");
    onSubmit(query.trim());
  };

  const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setQuery(value);

    if (error && value.trim()) {
      setError("");
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label
            htmlFor="query-input"
            className="block text-sm font-medium text-gray-700 mb-2"
          >
            Enter tool name
          </label>
          <Textarea
            id="query-input"
            value={query}
            onChange={handleChange}
            placeholder="Ex: Firebase..."
            className={`min-h-[120px] resize-none ${
              error ? "border-red-500 focus:border-red-500" : ""
            }`}
            maxLength={maxLength}
            disabled={loading}
            aria-describedby={error ? "query-error" : "query-hint"}
            aria-invalid={!!error}
          />
          <div className="flex justify-between items-center mt-2">
            <div id="query-hint" className="text-sm text-gray-500">
              {error ? (
                <span id="query-error" className="text-red-600" role="alert">
                  {error}
                </span>
              ) : (
                "Provide tool name for finding best alternative"
              )}
            </div>
            <span
              className={`text-sm ${
                query.length > maxLength * 0.9
                  ? "text-red-600"
                  : "text-gray-500"
              }`}
            >
              {query.length}/{maxLength}
            </span>
          </div>
        </div>

        <Button
          type="submit"
          disabled={loading || !query.trim() || query.length > maxLength}
          className="w-full sm:w-auto"
        >
          {loading ? (
            <>
              <Loader2
                className="mr-2 h-4 w-4 animate-spin"
                aria-hidden="true"
              />
              Analyzing...
            </>
          ) : (
            "Submit Query"
          )}
        </Button>
      </form>
    </div>
  );
};

export default QueryForm;
