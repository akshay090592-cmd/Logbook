import { LogEntryForm } from '../components/LogEntryForm';

export function LogEntry() {
  return (
    <div className="max-w-2xl mx-auto">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">New Log Entry</h1>
      <div className="bg-white shadow rounded-lg p-6">
        <LogEntryForm />
      </div>
    </div>
  );
}