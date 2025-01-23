import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useAuth } from '../contexts/AuthContext';

export function Approvals() {
  const { user } = useAuth();
  const [pendingEntries, setPendingEntries] = useState([]);
  const [selectedEntry, setSelectedEntry] = useState(null);

  useEffect(() => {
    fetchPendingEntries();
  }, [user]);

  async function fetchPendingEntries() {
    const { data, error } = await supabase
      .from('log_entries')
      .select(`
        *,
        profiles:user_id (
          fullName,
          medicalId
        )
      `)
      .eq('status', 'pending')
      .order('created_at', { ascending: false });

    if (!error) {
      setPendingEntries(data);
    }
  }

  async function handleApproval(entryId, status) {
    const { error } = await supabase
      .from('log_entries')
      .update({
        status,
        reviewed_by: user.id,
        reviewed_at: new Date()
      })
      .eq('id', entryId);

    if (!error) {
      fetchPendingEntries();
      setSelectedEntry(null);
    }
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold text-gray-900">Pending Approvals</h1>

      <div className="bg-white shadow rounded-lg">
        <ul className="divide-y divide-gray-200">
          {pendingEntries.map((entry) => (
            <li key={entry.id} className="px-4 py-4 sm:px-6">
              <div className="flex items-center justify-between">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-indigo-600 truncate">
                      {entry.procedure}
                    </p>
                    <p className="ml-2 text-sm text-gray-500">
                      {new Date(entry.created_at).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="mt-2">
                    <p className="text-sm text-gray-500">
                      Submitted by: {entry.profiles.fullName} ({entry.profiles.medicalId})
                    </p>
                    <p className="text-sm text-gray-500">
                      Patient ID: {entry.patientId}
                    </p>
                  </div>
                </div>
                <div className="ml-4 flex-shrink-0 flex space-x-2">
                  <button
                    onClick={() => handleApproval(entry.id, 'approved')}
                    className="text-sm font-medium text-green-600 hover:text-green-900"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleApproval(entry.id, 'rejected')}
                    className="text-sm font-medium text-red-600 hover:text-red-900"
                  >
                    Reject
                  </button>
                  <button
                    onClick={() => setSelectedEntry(entry)}
                    className="text-sm font-medium text-gray-600 hover:text-gray-900"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </li>
          ))}
        </ul>
      </div>

      {/* Entry Details Modal */}
      {selectedEntry && (
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
          <div className="bg-white rounded-lg max-w-2xl w-full p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium text-gray-900">Entry Details</h3>
              <button
                onClick={() => setSelectedEntry(null)}
                className="text-gray-400 hover:text-gray-500"
              >
                <span className="sr-only">Close</span>
                <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <h4 className="text-sm font-medium text-gray-500">Procedure</h4>
                <p className="mt-1">{selectedEntry.procedure}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Diagnosis</h4>
                <p className="mt-1">{selectedEntry.diagnosis}</p>
              </div>
              <div>
                <h4 className="text-sm font-medium text-gray-500">Notes</h4>
                <p className="mt-1">{selectedEntry.notes}</p>
              </div>
              {selectedEntry.images?.length > 0 && (
                <div>
                  <h4 className="text-sm font-medium text-gray-500">Images</h4>
                  <div className="mt-1 grid grid-cols-2 gap-2">
                    {selectedEntry.images.map((image, index) => (
                      <img
                        key={index}
                        src={image}
                        alt={`Entry image ${index + 1}`}
                        className="rounded-lg"
                      />
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}