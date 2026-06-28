"use client";

import { useState, useEffect, useRef } from "react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { getUserByEmail } from "../api/friends";
import { useSendFriendRequest } from "../hooks/use-friends";
import { Search, UserPlus, Loader2, CheckCircle2 } from "lucide-react";

export function FriendRequestSearch() {
  const [query, setQuery] = useState("");
  const [foundUser, setFoundUser] = useState<{ id: string; email: string } | null>(null);
  const [isSearching, setIsSearching] = useState(false);
  const [notFound, setNotFound] = useState(false);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  const {
    mutate: sendRequest,
    isPending: isSending,
    isSuccess,
    reset: resetMutation,
  } = useSendFriendRequest();

  const runSearch = async (email: string) => {
    if (!email || !email.includes("@") || !email.includes(".")) return;
    setFoundUser(null);
    setNotFound(false);
    setIsSearching(true);
    try {
      const user = await getUserByEmail(email);
      if (user) {
        setFoundUser({ id: user.id, email });
      } else {
        setNotFound(true);
      }
    } catch {
      setNotFound(true);
    } finally {
      setIsSearching(false);
    }
  };

  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    setFoundUser(null);
    setNotFound(false);
    resetMutation();

    if (!query || !query.includes("@") || !query.includes(".")) return;

    debounceRef.current = setTimeout(() => runSearch(query), 600);

    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      if (debounceRef.current) clearTimeout(debounceRef.current);
      runSearch(query);
    }
  };

  const handleSend = () => {
    if (!foundUser) return;
    sendRequest(foundUser.email);
    setFoundUser(null);
    setQuery("");
  };

  return (
    <div className="space-y-3">
      {/* Search input */}
      <div className="relative">
        <Search
          className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none"
          aria-hidden
        />
        {isSearching && (
          <Loader2
            className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground animate-spin"
            aria-hidden
          />
        )}
        <Input
          type="text"
          placeholder="Search by email"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onKeyDown={handleKeyDown}
          className="pl-9 pr-9 h-10"
          autoComplete="off"
        />
      </div>

      {/* Result */}
      {foundUser && !isSuccess && (
        <div className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card">
          <Avatar className="w-9 h-9 shrink-0">
            <AvatarFallback className="text-sm font-medium bg-muted text-muted-foreground">
              {foundUser.email[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-medium text-foreground truncate">
              {foundUser.email}
            </p>
          </div>
          <Button
            size="sm"
            onClick={handleSend}
            disabled={isSending}
            className="shrink-0 gap-1.5"
          >
            {isSending ? (
              <Loader2 className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <UserPlus className="w-3.5 h-3.5" />
            )}
            Add
          </Button>
        </div>
      )}

      {/* Success */}
      {isSuccess && (
        <div className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-green-50 dark:bg-green-950/30 border border-green-200 dark:border-green-800">
          <CheckCircle2 className="w-4 h-4 text-green-600 dark:text-green-400 shrink-0" />
          <p className="text-sm text-green-700 dark:text-green-300">
            Friend request sent.
          </p>
        </div>
      )}

      {/* Not found */}
      {notFound && query.length > 3 && (
        <p className="text-xs text-muted-foreground px-1">
          No account found for <span className="font-medium text-foreground">{query}</span>.
        </p>
      )}
    </div>
  );
}