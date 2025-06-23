
import { CompetitorResult } from '@/components/ResultCard';
import { HistoryEntry } from '@/components/HistoryTable';

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
  
  // Simulate API call
  const response = await fetch('/api/analyze', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query })
  }).catch(() => {
    // Mock response when API is not available
    return new Promise(resolve => 
      setTimeout(() => resolve({ ok: true }), 1500)
    );
  });

  // Return mock data for development
  return mockCompetitors.map(competitor => ({
    ...competitor,
    id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }));
};

export const saveQueryToHistory = async (query: string, results: CompetitorResult[]): Promise<void> => {
  console.log('Saving query to history:', { query, resultCount: results.length });
  
  // Mock save operation
  const historyEntry = {
    id: `history-${Date.now()}`,
    query,
    timestamp: new Date().toISOString(),
    resultCount: results.length
  };
  
  // In a real app, this would save to Supabase
  const existingHistory = JSON.parse(localStorage.getItem('queryHistory') || '[]');
  existingHistory.unshift(historyEntry);
  localStorage.setItem('queryHistory', JSON.stringify(existingHistory.slice(0, 50))); // Keep last 50 entries
};

export const getQueryHistory = async (): Promise<HistoryEntry[]> => {
  console.log('Fetching query history from storage');
  
  // Mock fetch from localStorage (in real app, this would use Supabase)
  const history = JSON.parse(localStorage.getItem('queryHistory') || '[]');
  return history;
};

export const deleteHistoryEntry = async (id: string): Promise<void> => {
  console.log('Deleting history entry:', id);
  
  const history = JSON.parse(localStorage.getItem('queryHistory') || '[]');
  const updatedHistory = history.filter((entry: HistoryEntry) => entry.id !== id);
  localStorage.setItem('queryHistory', JSON.stringify(updatedHistory));
};
