import { pickCats } from "./routing";
import { VectorizeService } from "../lib/retrieval/vectorize";

const MAX_CTX_CHARS = 20_000;
const PER_CHUNK_CAP = 1500;

export async function fetchVectorize(query: string, opts: any = {}) {
  const service = new VectorizeService();
  const documents = await service.retrieveDocuments(query, opts.topK || 6, opts.where ? { filter: opts.where } : undefined);
  
  return documents.map((doc: any) => ({
    id: doc.id,
    title: doc.source_display_name || doc.source || "Untitled",
    url: doc.source,
    text: doc.text,
    score: doc.similarity || doc.relevancy || 0,
    metadata: {
      source: "vectorize",
      category: doc.metadata?.category || "journals"
    }
  }));
}

export async function fetchVectorizeSmart(query: string, topK = 6) {
  const { cats } = pickCats(query);
  const where = cats.length ? { category: { $in: cats } } : undefined;

  const a = await fetchVectorize(query, { topK, where }).catch(()=>[]);
  const need = Math.max(0, topK - (a?.length || 0));
  const b = need ? await fetchVectorize(query, { topK: need }).catch(()=>[]) : [];

  const seen = new Set<string>();
  const merged = [...(a||[]), ...(b||[])]
    .filter((x:any)=>x?.id && !seen.has(x.id) && x.text?.trim() && seen.add(x.id))
    .sort((x:any,y:any)=>(y.score??0)-(x.score??0))
    .slice(0, topK)
    .map((c:any)=>({ ...c, text: (c.text || "").slice(0, PER_CHUNK_CAP) }));

  // budget cap
  let used = 0;
  const capped: any[] = [];
  for (const c of merged) {
    if (used + c.text.length > MAX_CTX_CHARS) break;
    capped.push(c); used += c.text.length;
  }
  return capped;
}
