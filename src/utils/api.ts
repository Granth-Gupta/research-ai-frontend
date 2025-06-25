// src/utils/api.ts

import { supabase } from "@/integrations/supabase/client";
// REMOVED: import { CompetitorResult } from "@/components/ResultCard";

// Define the structure of a single competitor result as it will be used in the frontend.
// These fields are mapped from your Render API's 'companies' array.
export interface CompetitorResult {
  id: string; // Unique identifier for React keys, derived from name or generated
  name: string;
  description: string;
  website: string;
  pricing_model?: string | null; // e.g., "Freemium", "Subscription"
  is_open_source?: boolean | null; // true, false, or null if unknown
  tech_stack?: string[] | null; // e.g., ["Cloud Run", "Cloud Build"]
  language_support?: string[] | null; // e.g., ["JavaScript", "Python"]
  api_available?: string | null; // e.g., "✅ Available", "❌ Not Available"
  integration_capabilities?: string[] | null; // specific integrations
  isBest?: boolean; // A frontend-specific flag, not directly from API
  reason?: string; // A frontend-specific reason for competitor inclusion, not directly from API
}

// Defines the expected structure of the overall response from your Render API.
// This matches the JSON output you provided from your `curl` command.
export interface AnalysisResponse {
  competitors: CompetitorResult[]; // The array of competitor objects
  developerRecommendations: string; // The textual recommendations from the AI
}

// Defines the structure for an entry stored in your Supabase query history table.
export interface HistoryEntry {
  id: string; // Supabase row ID
  query_text: string;
  created_at: string; // Timestamp from Supabase
  result_count: number; // Number of competitors found
  results?: CompetitorResult[]; // Stored results, optional for flexibility
  developerRecommendations?: string | null; // Add this line
}

// ================================================================
// Configuration: Your Deployed Render API URL
// This URL is critical for fetching data from your backend.
// ================================================================
const RENDER_API_URL = "https://research-api-0ff3.onrender.com";

/**
 * Communicates with the deployed Render API to analyze competitors based on a user query.
 * This function handles the API request, error handling, and data mapping from the
 * raw API response format to the frontend's `CompetitorResult` interface.
 *
 * @param query The business description or specific topic for which to find competitors.
 * @returns A Promise that resolves to an `AnalysisResponse` object containing the
 * list of competitors and developer recommendations.
 * @throws Error if the API request fails or returns an unexpected data format.
 */
export const analyzeCompetitors = async (
  query: string
): Promise<AnalysisResponse> => {
  console.log("Sending query to Render API for analysis:", query);

  try {
    // Construct the fetch request to your Render API.
    // The endpoint is '/run-research' and the query is sent in the body with key 'query'.
    const response = await fetch(`${RENDER_API_URL}/run-research`, {
      method: "POST", // Use POST method as per your API's requirement
      headers: {
        "Content-Type": "application/json", // Specify content type as JSON
        // Add any necessary authentication headers here if your Render API is secured.
        // For example:
        // 'Authorization': `Bearer YOUR_AUTH_TOKEN_HERE`,
        // 'X-API-Key': 'YOUR_API_KEY_HERE',
      },
      // Convert the query object to a JSON string for the request body.
      body: JSON.stringify({ query: query }),
    });

    // Check if the HTTP response status is OK (200-299 range).
    if (!response.ok) {
      const errorData = await response.json(); // Attempt to parse error details from the response
      console.error("Render API Error Response:", errorData); // Log the raw error data for debugging
      throw new Error(
        errorData.message ||
          `API request failed with status: ${response.status}`
      );
    }

    // Parse the successful JSON response from the API.
    const data: any = await response.json(); // Use 'any' initially for flexible parsing
    console.log("Render API Raw Response Data:", data); // Log the full raw response for inspection

    // Validate the top-level structure of the API response to ensure it contains
    // the expected 'companies' array and 'developer_recommendations' string.
    if (
      !data ||
      !Array.isArray(data.companies) ||
      typeof data.developer_recommendations !== "string"
    ) {
      throw new Error(
        'Render API returned an unexpected or incomplete data format. Expected "companies" array and "developer_recommendations" string.'
      );
    }

    // Map the 'companies' array from the API response to the `CompetitorResult` interface.
    // This transforms the raw data into a format usable by your frontend components.
    const mappedCompetitors: CompetitorResult[] = data.companies.map(
      (item: any, index: number) => ({
        // Generate a unique `id` for each competitor, preferring a slug from the name.
        // This is crucial for React list rendering and individual card identification.
        id: item.name
          ? item.name.replace(/\s+/g, "-").toLowerCase()
          : `comp-${index}-${Date.now()}-${Math.random()
              .toString(36)
              .substr(2, 5)}`,
        name: item.name || "Unnamed Competitor", // Provide fallback for name
        description: item.description || "No description provided.", // Provide fallback for description
        website: item.website || "", // Provide fallback for website
        pricing_model: item.pricing_model || null,
        is_open_source: item.is_open_source === true, // Explicitly convert to boolean, default false if null
        tech_stack: item.tech_stack || null,
        language_support: item.language_support || null,
        api_available: item.api_available || null,
        integration_capabilities: item.integration_capabilities || null,
        isBest: false, // This is a frontend-specific flag; API doesn't provide it directly.
        // You might add logic here to determine the "best" competitor if desired.
        reason: "Analysis from AI-powered research.", // Frontend-specific placeholder reason.
      })
    );

    // Return the final structured `AnalysisResponse` object.
    return {
      competitors: mappedCompetitors,
      developerRecommendations: data.developer_recommendations,
    };
  } catch (error) {
    // Log the full error object for comprehensive debugging in the console.
    console.error(
      "Error in analyzeCompetitors function (Render API integration):",
      error
    );
    // Re-throw the error so that it can be caught by the calling component (`Query.tsx`)
    // to update the UI with an error message.
    throw error;
  }
};

/**
 * Saves a user's query and its associated results to the Supabase database.
 * This ensures a history of queries is maintained.
 *
 * @param query The text string of the user's query.
 * @param results An array of `CompetitorResult` objects obtained from the analysis.
 * @returns A Promise that resolves when the data is successfully saved.
 * @throws Error if the user is not authenticated or Supabase operation fails.
 */
export const saveQueryToHistory = async (
  query: string,
  results: CompetitorResult[]
): Promise<void> => {
  console.log("Attempting to save query to Supabase history:", {
    query,
    resultCount: results.length,
  });

  // Get the current authenticated user from Supabase.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated. Cannot save query to history.");
  }

  // Insert the query and results into the 'query_history' table in Supabase.
  // `results` is cast to `any` because Supabase's JSON column type might require it.
  const { error } = await supabase.from("query_history").insert({
    user_id: user.id,
    query_text: query,
    results: results as any, // Cast for Supabase JSON column compatibility
    result_count: results.length,
  });

  if (error) {
    console.error("Error saving query to history in Supabase:", error);
    throw error;
  }
  console.log("Query successfully saved to Supabase history.");
};

/**
 * Fetches the historical queries and their results for the currently authenticated user from Supabase.
 *
 * @returns A Promise that resolves to an array of `HistoryEntry` objects,
 * ordered by creation date (newest first).
 * @throws Error if the user is not authenticated or Supabase operation fails.
 */
export const getQueryHistory = async (): Promise<HistoryEntry[]> => {
  console.log("Fetching query history from Supabase");

  // Get the current authenticated user from Supabase.
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user) {
    throw new Error("User not authenticated. Cannot fetch history.");
  }

  // Select all columns from 'query_history' for the current user, ordered by creation date.
  const { data, error } = await supabase
    .from("query_history")
    .select("*")
    .eq("user_id", user.id)
    .order("created_at", { ascending: false }); // Sort by newest first

  if (error) {
    console.error("Error fetching query history from Supabase:", error);
    throw error;
  }

  // Map the raw Supabase data to the `HistoryEntry` interface,
  // providing default values for potentially null fields.
  return (data || []).map((item) => ({
    id: item.id,
    query_text: item.query_text,
    created_at: item.created_at || "", // Default to empty string if null
    result_count: item.result_count || 0, // Default to 0 if null
    results: (item.results as unknown as CompetitorResult[]) || [], // Ensure it's an array of CompetitorResult
  }));
};

/**
 * Deletes a specific historical query entry from Supabase.
 *
 * @param id The unique ID of the history entry to be deleted.
 * @returns A Promise that resolves when the deletion is successful.
 * @throws Error if the Supabase operation fails.
 */
export const deleteHistoryEntry = async (id: string): Promise<void> => {
  console.log("Deleting history entry from Supabase:", id);

  // Delete the row from 'query_history' matching the provided ID.
  const { error } = await supabase.from("query_history").delete().eq("id", id); // Condition to match the row by ID

  if (error) {
    console.error("Error deleting history entry from Supabase:", error);
    throw error;
  }
  console.log(`History entry with ID ${id} successfully deleted.`);
};
