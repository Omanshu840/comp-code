"use client";

import { useState, useEffect } from "react";
import { usePendingFriendRequests, useAcceptFriendRequest, useDeclineFriendRequest } from "@/features/profile/hooks/use-friends";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Check, X, Loader2, Users } from "lucide-react";

export function FriendRequestToast() {
  const { data: requests } = usePendingFriendRequests();
  const { mutate: accept, isPending: isAccepting, variables: acceptingId } = useAcceptFriendRequest();
  const { mutate: decline, isPending: isDeclining, variables: decliningId } = useDeclineFriendRequest();

  // Track which request is currently shown
  const [currentIndex, setCurrentIndex] = useState(0);
  // Track dismissed IDs so we don't re-show them this session
  const [dismissed, setDismissed] = useState<Set<string>>(new Set());

  const visible = requests?.filter((r) => !dismissed.has(r.id)) ?? [];
  const current = visible[currentIndex] ?? null;

  // Reset index when list shrinks (accept/decline removes items)
  useEffect(() => {
    setCurrentIndex((i) => Math.min(i, Math.max(0, visible.length - 1)));
  }, [visible.length]);

  const handleDismiss = (id: string) => {
    setDismissed((prev) => new Set(prev).add(id));
  };

  const handleDecline = (id: string) => {
    decline(id);
    handleDismiss(id);
  };

  if (!current) return null;

  const name = current.requester_full_name || current.requester_email || "Someone";
  const initials = name[0].toUpperCase();
  const isThisAccepting = isAccepting && acceptingId === current.id;
  const isThisDeclining = isDeclining && decliningId === current.id;

  return (
    <div
      role="alert"
      aria-live="polite"
      className="fixed top-4 right-4 z-50 w-[320px] max-w-[calc(100vw-2rem)]"
    >
      <div className="rounded-2xl border border-border bg-card shadow-lg overflow-hidden">
        {/* Top bar: count indicator if multiple */}
        {visible.length > 1 && (
          <div className="flex items-center justify-between px-4 py-2 border-b border-border bg-muted/40">
            <div className="flex items-center gap-1.5">
              <Users className="w-3.5 h-3.5 text-muted-foreground" />
              <span className="text-xs text-muted-foreground">
                {visible.length} friend requests
              </span>
            </div>
            <div className="flex items-center gap-1">
              {visible.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentIndex(i)}
                  className={`w-1.5 h-1.5 rounded-full transition-colors ${
                    i === currentIndex
                      ? "bg-foreground"
                      : "bg-muted-foreground/30 hover:bg-muted-foreground/60"
                  }`}
                  aria-label={`Request ${i + 1}`}
                />
              ))}
            </div>
          </div>
        )}

        {/* Request body */}
        <div className="flex items-center gap-3 px-4 py-3">
          <Avatar className="w-10 h-10 shrink-0">
            <AvatarImage src={current.requester_avatar_url ?? undefined} />
            <AvatarFallback className="text-sm font-medium bg-muted text-muted-foreground">
              {initials}
            </AvatarFallback>
          </Avatar>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate leading-tight">
              {name}
            </p>
            <p className="text-xs text-muted-foreground truncate">
              wants to be friends
            </p>
          </div>

          {/* Dismiss */}
          <button
            onClick={() => handleDismiss(current.id)}
            className="shrink-0 text-muted-foreground hover:text-foreground transition-colors p-1 -mr-1"
            aria-label="Dismiss"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Actions */}
        <div className="flex gap-2 px-4 pb-3">
          <Button
            variant="outline"
            size="sm"
            className="flex-1 gap-1.5 h-8"
            onClick={() => handleDecline(current.id)}
            disabled={isThisAccepting || isThisDeclining}
          >
            {isThisDeclining ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <X className="w-3.5 h-3.5" />
            )}
            Decline
          </Button>
          <Button
            size="sm"
            className="flex-1 gap-1.5 h-8"
            onClick={() => accept(current.id)}
            disabled={isThisAccepting || isThisDeclining}
          >
            {isThisAccepting ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <Check className="w-3.5 h-3.5" />
            )}
            Accept
          </Button>
        </div>
      </div>
    </div>
  );
}