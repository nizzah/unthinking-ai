export function rerank(items: any[], cats: string[]) {
  return [...items].sort((a,b) => {
    const boost = (m:any) => (cats.includes(m?.category) ? 0.08 : 0);
    const sa = (a.score ?? 0) + boost(a.metadata);
    const sb = (b.score ?? 0) + boost(b.metadata);
    return sb - sa;
  });
}
