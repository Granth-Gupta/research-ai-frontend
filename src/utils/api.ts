
import { supabase } from '@/integrations/supabase/client';
import { CompetitorResult } from '@/components/ResultCard';

export interface HistoryEntry {
  id: string;
  query_text: string;
  created_at: string;
  result_count: number;
  results?: CompetitorResult[];
}

// Mock API responses for development
const mockCompetitors: CompetitorResult[] = [
  {
    id: '1',
    name: 'TechCorp Solutions',
    description: 'Leading provider of cloud-based business management software with AI-powered analytics and reporting.',
    website: 'https://example.com',
    reason: 'Direct competitor with similar target market and feature set, strong market presence in your industry.',
    isBest: true
  },
  {
    id: '2',
    name: 'InnovateSoft',
    description: 'Comprehensive business automation platform focusing on workflow optimization and team collaboration.',
    website: 'https://example.com'
  },
  {
    id: '3',
    name: 'DataDrive Pro',
    description: 'Enterprise-grade data management and analytics solution with real-time insights and custom dashboards.',
    website: 'https://example.com'
  },
  {
    id: '4',
    name: 'CloudFlow Systems',
    description: 'Cloud-native platform for digital transformation with integrated CRM and project management tools.',
    website: 'https://example.com'
  }
];

export const analyzeCompetitors = async (query: string): Promise<CompetitorResult[]> => {
  console.log('Analyzing competitors for query:', query);
  
  // Simulate API call - in a real app, this would be an actual API endpoint
  await new Promise(resolve => setTimeout(resolve, 1500));

  // Return mock data for development with unique IDs
  return mockCompetitors.map(competitor => ({
    ...competitor,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }));
};

export const saveQueryToHistory = async (query: string, results: CompetitorResult[]): Promise<void> => {
  console.log('Saving query to history:', { query, resultCount: results.length });
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { error } = await supabase
    .from('query_history')
    .insert({
      user_id: user.id,
      query_text: query,
      results: results as any, // Cast to any to handle Json type
      result_count: results.length
    });

  if (error) {
    console.error('Error saving query to history:', error);
    throw error;
  }
};

export const getQueryHistory = async (): Promise<HistoryEntry[]> => {
  console.log('Fetching query history from Supabase');
  
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) {
    throw new Error('User not authenticated');
  }

  const { data, error } = await supabase
    .from('query_history')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching query history:', error);
    throw error;
  }

  // Transform the data to match HistoryEntry interface
  return (data || []).map(item => ({
    id: item.id,
    query_text: item.query_text,
    created_at: item.created_at || '',
    result_count: item.result_count || 0,
    results: item.results as CompetitorResult[] || []
  }));
};

export const deleteHistoryEntry = async (id: string): Promise<void> => {
  console.log('Deleting history entry:', id);
  
  const { error } = await supabase
    .from('query_history')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting history entry:', error);
    throw error;
  }
};
