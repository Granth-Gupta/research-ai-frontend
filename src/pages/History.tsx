
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Navigation from '@/components/Navigation';
import HistoryTable from '@/components/HistoryTable';
import { getQueryHistory, deleteHistoryEntry, HistoryEntry } from '@/utils/api';

const History = () => {
  const [entries, setEntries] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    loadHistory();
  }, []);

  const loadHistory = async () => {
    try {
      const history = await getQueryHistory();
      setEntries(history);
    } catch (error) {
      console.error('Error loading history:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleViewResults = (entry: HistoryEntry) => {
    console.log('Viewing results for:', entry);
    // In a real app, this would navigate to results page with the specific query
    // For now, we'll navigate back to query page
    navigate('/', { state: { rerunQuery: entry.query_text } });
  };

  const handleDelete = async (id: string) => {
    await deleteHistoryEntry(id);
    setEntries(entries.filter(entry => entry.id !== id));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navigation />
      
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header */}
          <div className="text-center">
            <h1 className="text-3xl font-bold text-gray-900 sm:text-4xl">
              Query History
            </h1>
            <p className="mt-4 text-lg text-gray-600 max-w-2xl mx-auto">
              Review your previous competitor analyses and revisit results.
            </p>
          </div>

          {/* History Table */}
          <div className="max-w-6xl mx-auto">
            <HistoryTable
              entries={entries}
              onViewResults={handleViewResults}
              onDelete={handleDelete}
              loading={loading}
            />
          </div>
        </div>
      </main>
    </div>
  );
};

export default History;
