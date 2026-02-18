import React, { useState } from "react";

const ADMIN_PASSWORD = "it0ps@1234=";

type Props = {
  onSuccess: () => void;
  onCancel?: () => void;
};

export default function PasswordGate({ onSuccess, onCancel }: Props) {
  const [pwd, setPwd] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleCheck = () => {
    setLoading(true);

    setTimeout(() => {
      if (pwd.trim() === ADMIN_PASSWORD.trim()) {
        setError("");
        onSuccess();
      } else {
        setError("Incorrect password — try again.");
      }
      setLoading(false);
    }, 200);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") handleCheck();
  };

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="w-full max-w-sm bg-white dark:bg-gray-800 p-5 rounded shadow">

        <h3 className="text-lg font-semibold mb-3 text-center">
          Admin password required
        </h3>

        <input
          type="password"
          value={pwd}
          onChange={(e) => {
            setPwd(e.target.value);
            setError("");
          }}
          onKeyDown={handleKey}
          placeholder="Enter admin password"
          className="w-full p-2 border rounded mb-3"
        />

        <div className="flex justify-end gap-2">
          <button
            onClick={handleCheck}
            disabled={loading}
            className="px-3 py-1 rounded bg-blue-600 text-white w-full"
          >
            {loading ? "Checking..." : "Unlock"}
          </button>

          {onCancel && (
            <button
              onClick={onCancel}
              className="px-3 py-1 rounded border w-full"
            >
              Cancel
            </button>
          )}
        </div>

        {error && (
          <p className="text-red-500 mt-2 text-center">
            {error}
          </p>
        )}

      </div>
    </div>
  );
}
