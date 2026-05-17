import { useQuery } from "@tanstack/react-query";
import { AIChat } from "@/features/ai/chat/AIChat";
import { AIInsightCard } from "@/features/ai/components/AIInsightCard";
import { RecommendationLab } from "@/features/ai/recommendations/RecommendationLab";
import { aiService } from "@/features/ai/services/ai.service";
import { PageHeader } from "@/components/common/PageHeader";
import { SuspenseFallback } from "@/components/common/SuspenseFallback";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function AIAssistantPage() {
  useDocumentTitle("AI Assistant", "AI-native music assistant and recommendation cockpit.");
  const { data, isLoading } = useQuery({ queryKey: ["ai-assistant"], queryFn: aiService.getAssistantState });

  if (isLoading) {
    return <SuspenseFallback />;
  }

  return (
    <div className="space-y-6">
      <PageHeader
        eyebrow="Phase 8"
        title="AI assistant"
        description="Conversational curation, taste-vector analysis, smart playlist generation, and animated recommendation cards."
      />
      <div className="grid gap-6 xl:grid-cols-[1fr_420px]">
        <AIChat />
        <div className="space-y-4">
          {data.insights.map((insight) => (
            <AIInsightCard key={insight.title} insight={insight} />
          ))}
        </div>
      </div>
      <RecommendationLab songs={data.recommendations} />
    </div>
  );
}
