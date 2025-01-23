import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function Dashboard() {
  const { user } = useAuth();
  const [entries, setEntries] = useState([]);
  const [stats, setStats] = useState({
    total: 0,
    pending: 0,
    approved: 0
  });

  useEffect(() => {
    fetchEntries();
    calculateStats();
  }, [user]);

  async function fetchEntries() {
    const { data, error } = await supabase
      .from('log_entries')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(10);

    if (error) {
      console.error('Error fetching entries:', error);
    } else {
      setEntries(data);
    }
  }

  async function calculateStats() {
    const { data, error } = await supabase
      .from('log_entries')
      .select('status', { count: 'exact' })
      .eq('user_id', user.id);

    if (!error && data) {
      setStats({
        total: data.length,
        pending: data.filter(entry => entry.status === 'pending').length,
        approved: data.filter(entry => entry.status === 'approved').length
      });
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Total Entries</h3>
          <p className="text-3xl font-bold text-indigo-600">{stats.total}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Pending Approval</h3>
          <p className="text-3xl font-bold text-yellow-600">{stats.pending}</p>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-medium text-gray-900">Approved</h3>
          <p className="text-3xl font-bold text-green-600">{stats.approved}</p>
        </div>
      </div>

      {/* Recent Entries */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:px-6">
          <h2 className="text-lg font-medium text-gray-900">Recent Entries</h2>
        </div>
        <ul className="divide-y divide-gray-200">
          {entries.map((entry) => (
            <li key={entry.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-indigo-600 truncate">
                    {entry.procedure}
                  </p>
                  <p className="text-sm text-gray-500">
                    Patient ID: {entry.patientId}
                  </p>
                </div>
                <div className="ml-4 flex-shrink-0">
                  <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                    entry.status === 'approved' 
                      ? 'bg-green-100 text-green-800'
                      : 'bg-yellow-100 text-yellow-800'
                  }`}>
                    {entry.status}
                  </span>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}