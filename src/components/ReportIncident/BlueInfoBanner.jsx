import { Info } from 'lucide-react';

export default function BlueInfoBanner() {
  return (
    <div className="w-full flex items-center gap-3 bg-blue-50 border border-blue-200 text-blue-800 px-4 py-3 rounded-xl text-sm font-medium">
      <div className="flex items-center justify-center w-6 h-6 bg-blue-100 text-blue-600 rounded-full">
        <Info className="w-7 h-7" />
      </div>
      <span>Use this to report a safety-related incident that occurred earlier.</span>
    </div>
  );
}