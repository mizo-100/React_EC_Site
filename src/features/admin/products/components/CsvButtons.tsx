import { useState } from "react";
import { csvApi } from "../api/csvApi";

export const CsvButtons = () => {
  const [isImporting, setIsImporting] = useState(false);

  const handleExport = async () => {
    await csvApi.export();
  };

  const handleImport = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsImporting(true);
    try {
      await csvApi.import(file);
      alert("インポート完了");
      window.location.reload();
    } catch {
      alert("インポート失敗");
    } finally {
      setIsImporting(false);
      e.target.value = "";
    }
  };

  return (
    <div className="flex gap-2">
      <button
        type="button"
        onClick={handleExport}
        className="rounded-lg border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50"
      >
        CSV エクスポート
      </button>

      <label className="inline-flex cursor-pointer items-center justify-center rounded-lg bg-blue-600 px-4 py-2 text-sm font-bold text-white hover:bg-blue-700 disabled:opacity-50">
        CSV インポート
        <input
          type="file"
          accept=".csv"
          onChange={handleImport}
          disabled={isImporting}
          className="hidden"
        />
      </label>
    </div>
  );
}
