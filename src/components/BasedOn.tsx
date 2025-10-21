const FRIENDLY = { learnings:"Reading + Listening", daily:"Daily journal", weekly:"Weekly Dashboard" };

export function BasedOn({ sources }: { sources: Array<{title:string; url?:string|null; meta?:any}> }) {
  if (!sources?.length) return null;
  return (
    <div className="mt-4 text-sm text-muted-foreground">
      <div className="font-medium text-foreground mb-1">Based on</div>
      <ul className="list-disc pl-5 space-y-1">
        {sources.slice(0,3).map((s, i) => (
          <li key={i}>
            {s?.url ? <a href={s.url} target="_blank" className="underline">{s.title}</a> : s.title}
          </li>
        ))}
      </ul>
    </div>
  );
}
