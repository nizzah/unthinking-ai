import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="flex flex-col gap-4">
        <Link href="/unthinking" className="text-center bg-[#FF591F] text-white px-6 py-3 rounded-lg font-semibold">
          🧭 Unthinking App (MVP)
        </Link>
        <div className="text-sm text-gray-500 text-center mb-4">Transform stuck moments into micro-actions</div>
        <div className="border-t pt-4">
          <div className="text-sm text-gray-400 mb-2">Original Demo Agents:</div>
          <Link href="/simple-agent" className="text-center block py-2 hover:bg-gray-100 rounded">
            Simple Agent
          </Link>
          <Link href="/rag-agent" className="text-center block py-2 hover:bg-gray-100 rounded">
            RAG Agent
          </Link>
          <Link href="/agent-with-mcp-tools" className="text-center block py-2 hover:bg-gray-100 rounded">
            Agent with MCP Tools
          </Link>
        </div>
      </div>
    </div>
  );
}
