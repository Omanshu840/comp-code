import { usePendingFriendRequests, useAcceptFriendRequest, useDeclineFriendRequest } from '../hooks/use-friends';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Bell, Check, X, Loader2 } from 'lucide-react';

export function IncomingRequestsNotification() {
  const { data: requests, isLoading } = usePendingFriendRequests();
  const { mutate: accept, isPending: isAccepting, variables: acceptingId } = useAcceptFriendRequest();
  const { mutate: decline, isPending: isDeclining, variables: decliningId } = useDeclineFriendRequest();

  if (isLoading || !requests?.length) return null;

  return (
    <section>
      {/* Header */}
      <div className="flex items-center gap-2 mb-3">
        <div className="relative">
          <Bell className="w-4 h-4 text-muted-foreground" />
          <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-red-500 rounded-full flex items-center justify-center">
            <span className="text-[9px] font-bold text-white leading-none">
              {requests.length > 9 ? '9+' : requests.length}
            </span>
          </span>
        </div>
        <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
          Requests for you
        </h2>
      </div>

      {/* Request cards */}
      <div className="space-y-2">
        {requests.map((req) => {
          const name = req.requester_full_name || req.requester_email || 'Someone';
          const initials = name[0].toUpperCase();
          const isThisAccepting = isAccepting && acceptingId === req.id;
          const isThisDeclining = isDeclining && decliningId === req.id;

          return (
            <div
              key={req.id}
              className="flex items-center gap-3 p-3 rounded-xl border border-border bg-card"
            >
              {/* Avatar */}
              <Avatar className="w-10 h-10 shrink-0">
                <AvatarImage src={req.requester_avatar_url ?? undefined} />
                <AvatarFallback className="text-sm font-medium bg-muted text-muted-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>

              {/* Name / email */}
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate leading-tight">
                  {req.requester_full_name || req.requester_email}
                </p>
                {req.requester_full_name && (
                  <p className="text-xs text-muted-foreground truncate">
                    {req.requester_email}
                  </p>
                )}
              </div>

              {/* Actions */}
              <div className="flex gap-1.5 shrink-0">
                <Button
                  size="icon"
                  variant="ghost"
                  className="h-8 w-8 rounded-full text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                  onClick={() => decline(req.id)}
                  disabled={isThisAccepting || isThisDeclining}
                  aria-label="Decline"
                >
                  {isThisDeclining ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <X className="w-4 h-4" />
                  )}
                </Button>
                <Button
                  size="icon"
                  className="h-8 w-8 rounded-full bg-green-500 hover:bg-green-600 text-white border-0"
                  onClick={() => accept(req.id)}
                  disabled={isThisAccepting || isThisDeclining}
                  aria-label="Accept"
                >
                  {isThisAccepting ? (
                    <Loader2 className="w-4 h-4 animate-spin" />
                  ) : (
                    <Check className="w-4 h-4" />
                  )}
                </Button>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}