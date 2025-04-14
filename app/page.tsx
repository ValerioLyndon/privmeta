import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Lock } from "lucide-react";

const Hero = () => {
  return (
    <div className="flex flex-col gap-[var(--space-md)] w-full max-w-[var(--max-content-width)] px-[var(--space-md)]">
      <div className="flex gap-[var(--space-lg)] items-center">
        <h1 className="text-4xl font-bold">Remove metadata privately</h1>
        <Lock size={32} strokeWidth={3} />
      </div>

      <div className="text-lg text-muted-foreground">
        <p>Clean your files of hidden metadata without ever uploading them.</p>
        <p>Everything runs in your browser. Open Source. Private by design.</p>
      </div>
      <div className="flex gap-[var(--space-md)]">
        <Button>Try it now</Button>
      </div>
    </div>
  );
};

const SeparatorSection = () => {
  return (
    <div className="w-full max-w-[var(--max-content-width)] px-[var(--space-md)]">
      <Separator />
    </div>
  );
};

export default function Home() {
  return (
    <div className="flex flex-col gap-[var(--space-2xl)] w-full h-full items-center pt-[var(--space-2xl)]">
      <Hero />
      <SeparatorSection />
    </div>
  );
}
