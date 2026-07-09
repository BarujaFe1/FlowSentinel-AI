"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight, Flag } from "lucide-react";
import type { ConversationMessage } from "@/lib/types";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

export function ConversationReplay({ messages }: { messages: ConversationMessage[] }) {
  const [index, setIndex] = useState(0);
  const visible = messages.slice(0, index + 1);
  const current = messages[index];

  return (
    <div className="space-y-4">
      <div className="max-h-96 space-y-3 overflow-y-auto rounded-lg border border-[var(--border)] bg-[var(--bg-elevated)] p-4">
        {visible.map((msg) => (
          <div
            key={msg.id}
            className={cn(
              "flex",
              msg.role === "user" ? "justify-end" : "justify-start",
            )}
          >
            <div
              className={cn(
                "max-w-[80%] rounded-2xl px-4 py-2 text-sm",
                msg.role === "user"
                  ? "bg-[var(--accent-teal)]/20 text-[var(--text-primary)]"
                  : "bg-[var(--bg-surface)] text-[var(--text-primary)]",
                msg.flagged && "ring-2 ring-[var(--risk-critical)]/50",
              )}
            >
              {msg.flagged && (
                <span className="mb-1 flex items-center gap-1 text-xs text-[var(--risk-critical)]">
                  <Flag className="h-3 w-3" /> {msg.failureReason}
                </span>
              )}
              {msg.content}
            </div>
          </div>
        ))}
      </div>
      <div className="flex items-center justify-between">
        <Button
          variant="ghost"
          size="sm"
          disabled={index === 0}
          onClick={() => setIndex(index - 1)}
        >
          <ChevronLeft className="h-4 w-4" />
        </Button>
        <span className="text-xs text-[var(--text-muted)]">
          Turn {index + 1} / {messages.length}
          {current && ` · ${current.role}`}
        </span>
        <Button
          variant="ghost"
          size="sm"
          disabled={index >= messages.length - 1}
          onClick={() => setIndex(index + 1)}
        >
          <ChevronRight className="h-4 w-4" />
        </Button>
      </div>
    </div>
  );
}
