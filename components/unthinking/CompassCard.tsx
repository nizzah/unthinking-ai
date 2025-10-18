"use client";
import { Card, CardHeader, CardContent } from "@/components/ui/card";

type Compass = {
  spark: string;
  step: string;
  rationale: string;
  feltLighterPrompt: string;
};

export function CompassCard({ data }: { data: Compass }) {
  return (
    <Card className="bg-white">
      <CardHeader>
        <div className="text-xs uppercase tracking-wide text-gray-500">Spark</div>
        <div className="text-lg">{data.spark}</div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <div className="text-xs uppercase text-gray-500">Step</div>
          <div className="font-semibold">{data.step}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-gray-500">Why this</div>
          <div>{data.rationale}</div>
        </div>
        <div>
          <div className="text-xs uppercase text-gray-500">Check in</div>
          <div>{data.feltLighterPrompt}</div>
        </div>
      </CardContent>
    </Card>
  );
}
