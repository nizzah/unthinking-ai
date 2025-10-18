"use client";
import { useState } from "react";
import { StuckForm } from "@/components/unthinking/StuckForm";
import { CompassCard } from "@/components/unthinking/CompassCard";
import { FeltLighter } from "@/components/unthinking/FeltLighter";

type Compass = {
  spark: string;
  step: string;
  rationale: string;
  feltLighterPrompt: string;
};

export default function UnthinkingPage() {
  const [data, setData] = useState<Compass | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);

  async function getCompass(userText: string) {
    setError(null);
    setData(null);
    const res = await fetch("/api/unthinking", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ userText }),
    });
    const json = await res.json();
    if (!res.ok) {
      setError(json?.error ?? "Failed to get spark");
      return;
    }
    setData(json as Compass);
    try {
      localStorage.setItem("unthinking:lastInput", userText);
      localStorage.setItem("unthinking:lastResult", JSON.stringify(json));
    } catch {}
  }

  function handleCheckIn(value: number) {
    setSaving(true);
    try {
      localStorage.setItem("unthinking:lastCheckIn", String(value));
    } catch {}
    setSaving(false);
    alert("Saved. Demo complete.");
  }

  return (
    <main className="min-h-screen bg-[#052135] text-white flex items-center justify-center p-6">
      <div className="w-full max-w-xl space-y-6">
        <h1 className="text-2xl font-semibold">Unthinking Compass</h1>

        {!data && <StuckForm onSubmit={getCompass} />}

        {error && (
          <div className="rounded-xl bg-red-100 text-red-800 p-4">{error}</div>
        )}

        {data && (
          <div className="space-y-6">
            <CompassCard data={data} />
            <FeltLighter onSubmit={handleCheckIn} />
            <button
              className="w-full py-2 rounded-xl bg-[#FF591F] text-black font-medium"
              onClick={() => {
                setData(null);
                setError(null);
              }}
              disabled={saving}
            >
              Start over
            </button>
          </div>
        )}
      </div>
    </main>
  );
}