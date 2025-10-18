"use client";
import { useState } from "react";
import { Button } from "@/components/ui/button";

export function FeltLighter({ onSubmit }: { onSubmit: (v: number) => void }) {
  const [val, setVal] = useState(3);
  return (
    <div className="space-y-3">
      <div className="text-sm">How much lighter do you feel? 1 to 5</div>
      <input
        type="range"
        min="1"
        max="5"
        step="1"
        value={val}
        onChange={(e) => setVal(Number(e.target.value))}
        className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
        style={{
          background: `linear-gradient(to right, #FF591F 0%, #FF591F ${((val - 1) / 4) * 100}%, #e5e7eb ${((val - 1) / 4) * 100}%, #e5e7eb 100%)`
        }}
      />
      <div className="text-sm">Selected: {val}</div>
      <Button onClick={() => onSubmit(val)} className="w-full">Save check-in</Button>
    </div>
  );
}
