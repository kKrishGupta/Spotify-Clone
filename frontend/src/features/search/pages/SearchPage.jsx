import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { PageHeader } from "@/components/common/PageHeader";
import { SuspenseFallback } from "@/components/common/SuspenseFallback";
import { AISearchPanel } from "@/features/search/ai-search/AISearchPanel";
import { SearchResults } from "@/features/search/components/SearchResults";
import { searchService } from "@/features/search/services/search.service";
import { SemanticMap } from "@/features/search/semantic/SemanticMap";
import { useDebounce } from "@/hooks/useDebounce";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function SearchPage() {
  useDocumentTitle("Search", "Semantic AI music search.");
  const [query, setQuery] = useState("neon focus night drive");
  const debounced = useDebounce(query, 250);
  const { data, isLoading } = useQuery({
    queryKey: ["semantic-search", debounced],
    queryFn: () => searchService.semanticSearch(debounced),
  });

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Phase 8"
        title="Semantic AI search"
        description="Search by feeling, context, language, lyric fragments, or recommendation intent."
      />
      <div className="relative">
        <Search className="pointer-events-none absolute left-4 top-4 size-5 text-muted-foreground" />
        <Input
          className="h-14 rounded-lg pl-12 text-base"
          value={query}
          onChange={(event) => setQuery(event.target.value)}
          placeholder="Describe a sound, mood, scene, or artist..."
        />
      </div>
      {isLoading ? (
        <SuspenseFallback />
      ) : (
        <div className="grid gap-6 xl:grid-cols-[1fr_360px]">
          <SearchResults results={data} />
          <div className="space-y-4">
            <SemanticMap score={data.semanticScore} />
            <AISearchPanel suggestions={data.suggestions} onSelect={setQuery} />
          </div>
        </div>
      )}
    </div>
  );
}
