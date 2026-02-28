"use client"

import { useCallback, useState } from "react"
import { useConversation } from "@elevenlabs/react"
import { AnimatePresence, motion } from "framer-motion"
import { Loader2Icon, AudioLinesIcon, PhoneOffIcon } from "lucide-react"

import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { ConversationBar } from "@/components/ui/conversation-bar"
import { Orb } from "@/components/ui/orb"
import { ShimmeringText } from "@/components/ui/shimmering-text"

const AGENT_ID = process.env.NEXT_PUBLIC_ELEVENLABS_AGENT_ID!

type AgentState =
  | "disconnected"
  | "connecting"
  | "connected"
  | "disconnecting"
  | null

export default function Page() {
  const [started, setStarted] = useState(false)
  const [agentState, setAgentState] = useState<AgentState>("disconnected")

  const isConnected = agentState === "connected"
  const isTransitioning =
    agentState === "connecting" || agentState === "disconnecting"

  // Shared useConversation for the Orb volume visualisation
  const conversation = useConversation()

  const getInputVolume = useCallback(() => {
    const rawValue = conversation.getInputVolume?.() ?? 0
    return Math.min(1.0, Math.pow(rawValue, 0.5) * 2.5)
  }, [conversation])

  const getOutputVolume = useCallback(() => {
    const rawValue = conversation.getOutputVolume?.() ?? 0
    return Math.min(1.0, Math.pow(rawValue, 0.5) * 2.5)
  }, [conversation])

  const handleStart = useCallback(() => {
    setStarted(true)
  }, [])

  return (
    <main className="relative flex min-h-screen flex-col items-center justify-center overflow-hidden bg-background px-4">
      {/* Orb — always centered, reacts to connection state */}
      <motion.div
        animate={started ? { scale: 0.85, y: -60 } : { scale: 1, y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="relative size-44"
      >
        <div className="bg-muted relative h-full w-full rounded-full p-1 shadow-[inset_0_2px_8px_rgba(0,0,0,0.1)] dark:shadow-[inset_0_2px_8px_rgba(0,0,0,0.5)]">
          <div className="bg-background h-full w-full overflow-hidden rounded-full shadow-[inset_0_0_12px_rgba(0,0,0,0.05)] dark:shadow-[inset_0_0_12px_rgba(0,0,0,0.3)]">
            <Orb
              colors={["#b6a78e", "#254e64"]}
              className="h-full w-full"
              volumeMode="manual"
              getInputVolume={getInputVolume}
              getOutputVolume={getOutputVolume}
            />
          </div>
        </div>
      </motion.div>

      {/* Agent name + status */}
      <motion.div
        animate={started ? { y: -50 } : { y: 0 }}
        transition={{ type: "spring", stiffness: 120, damping: 20 }}
        className="mt-6 flex flex-col items-center gap-2"
      >
        <h1 className="text-xl font-semibold">Survey Assistant</h1>
        <AnimatePresence mode="wait">
          {agentState === "disconnected" || agentState === null ? (
            <motion.p
              key="idle"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="text-muted-foreground text-sm"
            >
              {started ? "Ready to connect" : "Powered by Socratix AI"}
            </motion.p>
          ) : isTransitioning ? (
            <motion.div
              key="transitioning"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="flex items-center gap-2"
            >
              <div className="bg-primary/60 h-2 w-2 animate-pulse rounded-full" />
              <ShimmeringText
                text={agentState ?? ""}
                className="text-sm capitalize"
              />
            </motion.div>
          ) : isConnected ? (
            <motion.div
              key="connected"
              initial={{ opacity: 0, y: -6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 6 }}
              className="flex items-center gap-2"
            >
              <div className="h-2 w-2 rounded-full bg-green-500 shadow-[0_0_8px_rgba(34,197,94,0.5)]" />
              <span className="text-sm text-green-600">Connected</span>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </motion.div>

      {/* Pre-start call-to-action button */}
      <AnimatePresence>
        {!started && (
          <motion.div
            key="cta"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ type: "spring", stiffness: 200, damping: 20 }}
            className="mt-8"
          >
            <Button
              size="lg"
              onClick={handleStart}
              className="gap-2 rounded-full px-8"
            >
              <AudioLinesIcon className="h-4 w-4" />
              Start Conversation
            </Button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ConversationBar — slides up from the bottom once started */}
      <AnimatePresence>
        {started && (
          <motion.div
            key="bar"
            initial={{ y: 120, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 120, opacity: 0 }}
            transition={{ type: "spring", stiffness: 160, damping: 24 }}
            className="absolute bottom-0 w-full max-w-2xl"
          >
            <ConversationBar
              agentId={AGENT_ID}
              autoStart
              onConnect={() => setAgentState("connected")}
              onDisconnect={() => setAgentState("disconnected")}
              onError={() => setAgentState("disconnected")}
            />
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  )
}
