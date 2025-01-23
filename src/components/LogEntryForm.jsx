import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { supabase } from '../lib/supabase';

export function LogEntryForm() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    patientId: '',
    procedure: '',
    diagnosis: '',
    notes: '',
    images: []
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    try {
      const { data, error } = await supabase
        .from('log_entries')
        .insert([
          {
            user_id: user.id,
            ...formData,
            status: 'pending'
          }
        ]);

      if (error) throw error;
      
      // Reset form and show success message
      setFormData({
        patientId: '',
        procedure: '',
        diagnosis: '',
        notes: '',
        images: []
      });
      
    } catch (error) {
      console.error('Error:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-gray-700">
          Patient ID
        </label>
        <input
          type="text"
          value={formData.patientId}
          onChange={(e) => setFormData({...formData, patientId: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Procedure
        </label>
        <input
          type="text"
          value={formData.procedure}
          onChange={(e) => setFormData({...formData, procedure: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Diagnosis
        </label>
        <input
          type="text"
          value={formData.diagnosis}
          onChange={(e) => setFormData({...formData, diagnosis: e.target.value})}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
          required
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Notes
        </label>
        <textarea
          value={formData.notes}
          onChange={(e) => setFormData({...formData, notes: e.target.value})}
          rows={4}
          className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700">
          Upload Images
        </label>
        <input
          type="file"
          accept="image/*"
          multiple
          onChange={(e) => setFormData({...formData, images: Array.from(e.target.files)})}
          className="mt-1 block w-full"
        />
      </div>

      <button
        type="submit"
        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
      >
        Submit Entry
      </button>
    </form>
  );
}