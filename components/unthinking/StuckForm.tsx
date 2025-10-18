"use client";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";

export function StuckForm({ onSubmit }: { onSubmit: (t: string) => void }) {
  const [text, setText] = useState("");
  const [busy, setBusy] = useState(false);

  async function handleSubmit() {
    if (!text.trim()) return;
    setBusy(true);
    await onSubmit(text.trim());
    setBusy(false);
  }

  return (
    <div className="space-y-3">
      <label className="text-sm font-medium">What feels heavy or stuck?</label>
      <Textarea
        value={text}
        onChange={(e) => setText(e.target.value)}
        placeholder="Example: I am avoiding writing the intro paragraph."
        className="min-h-28"
      />
      <Button onClick={handleSubmit} disabled={busy} className="w-full">
        {busy ? "Working..." : "Get spark"}
      </Button>
    </div>
  );
}
