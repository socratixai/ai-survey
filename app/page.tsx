import Link from "next/link";
import { Button } from "@/components/ui/button";
import { MicIcon, MessageSquareIcon, ClockIcon } from "lucide-react";

export default function Home() {
  return (
    <main className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="max-w-xl w-full text-center space-y-8">
        {/* Header */}
        <div className="space-y-3">
          <h1 className="text-4xl font-bold tracking-tight">Project Horizons <br /> AI Master Mind Series</h1>
          <p className="text-muted-foreground text-lg">
            Help us prepare for our first session together through a short conversation with Hermes, our AI
            assistant. Speak naturally or type.
          </p>
        </div>

        {/* Feature highlights */}
        <div className="grid grid-cols-3 gap-4 text-sm">
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-card">
            <MicIcon className="size-5 text-muted-foreground" />
            <span className="text-muted-foreground">Voice or text</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-card">
            <ClockIcon className="size-5 text-muted-foreground" />
            <span className="text-muted-foreground">~5 minutes</span>
          </div>
          <div className="flex flex-col items-center gap-2 p-4 rounded-lg border bg-card">
            <MessageSquareIcon className="size-5 text-muted-foreground" />
            <span className="text-muted-foreground">3–5 questions</span>
          </div>
        </div>

        {/* CTA */}
        <Button asChild size="lg" className="w-full sm:w-auto px-10">
          <Link href="/voice-chat-2">Start Survey</Link>
        </Button>

        <p className="text-xs text-muted-foreground">
          Your microphone will be requested only if you choose voice mode.
        </p>
      </div>
    </main>
  );
}
