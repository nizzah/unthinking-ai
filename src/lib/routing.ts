export type Cat =
  | "goals" | "profiles" | "ideas" | "fears" | "journals"
  | "learnings" | "daily" | "weekly";

export function pickCats(t: string): { cats: Cat[]; conf: number } {
  const s = (t || "").toLowerCase();
  const hits = new Set<Cat>();

  if (/\b(goal|weekly|okr|milestone)\b/.test(s)) hits.add("goals");
  if (/\b(strength|saboteur|enneagram|big\s*5|profile)\b/.test(s)) hits.add("profiles");
  if (/\b(idea|brainstorm|concept|hypothesis)\b/.test(s)) hits.add("ideas");
  if (/\b(fear|anxiet|worry|doubt|angry|shame)\b/.test(s)) { hits.add("fears"); hits.add("journals"); }
  if (/\b(read|book|podcast|article|paper|highlight|quote|notes?)\b/.test(s)) hits.add("learnings");
  if (/\b(morning\s*pages|morning\s*manifesto|journal|today|daily|intention)\b/.test(s)) hits.add("daily");
  if (/\b(weekly\s*(review|retro|reflection)|plan\s*this\s*week|last\s*week)\b/.test(s)) hits.add("weekly");

  const cats = [...hits];
  return { cats, conf: Math.min(1, cats.length / 2) };
}
