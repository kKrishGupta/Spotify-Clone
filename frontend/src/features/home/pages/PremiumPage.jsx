import { PremiumSection } from "@/features/home/components/PremiumSection";
import { useDocumentTitle } from "@/hooks/useDocumentTitle";

export default function PremiumPage() {
  useDocumentTitle("Premium", "BeatFlow AI premium plans.");

  return (
    <div className="-mx-4 -mt-6 md:-mx-6">
      <PremiumSection />
    </div>
  );
}
