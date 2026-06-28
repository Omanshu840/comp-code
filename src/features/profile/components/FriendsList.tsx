import { useFriends } from '../hooks/use-friends';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Users } from 'lucide-react';

export const FriendsList = () => {
  const { data: friends, isLoading, isError } = useFriends();

  return (
    <section>
      <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        Friends {friends?.length ? `· ${friends.length}` : ''}
      </h2>

      {isLoading && (
        <div className="space-y-2">
          {[...Array(3)].map((_, i) => (
            <div
              key={i}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border bg-card animate-pulse"
            >
              <div className="w-9 h-9 rounded-full bg-muted shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-3 bg-muted rounded w-24" />
                <div className="h-2.5 bg-muted rounded w-32" />
              </div>
            </div>
          ))}
        </div>
      )}

      {isError && (
        <Alert variant="destructive">
          <AlertDescription>Could not load friends list.</AlertDescription>
        </Alert>
      )}

      {!isLoading && !isError && friends?.length === 0 && (
        <div className="flex flex-col items-center py-8 text-center">
          <div className="w-12 h-12 rounded-full bg-muted flex items-center justify-center mb-3">
            <Users className="w-5 h-5 text-muted-foreground" />
          </div>
          <p className="text-sm font-medium text-foreground">No friends yet</p>
          <p className="text-xs text-muted-foreground mt-1">
            Search by email above to send your first request.
          </p>
        </div>
      )}

      {!isLoading && friends && friends.length > 0 && (
        <div className="space-y-2">
          {friends.map((friend) => {
            const initials = (friend.full_name || friend.email || '?')[0].toUpperCase();

            return (
              <div
                key={friend.id}
                className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border bg-card"
              >
                <Avatar className="w-9 h-9 shrink-0">
                  <AvatarImage src={friend.avatar_url ?? undefined} />
                  <AvatarFallback className="text-sm font-medium bg-muted text-muted-foreground">
                    {initials}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-foreground truncate leading-tight">
                    {friend.full_name || friend.email}
                  </p>
                  {friend.full_name && (
                    <p className="text-xs text-muted-foreground truncate">
                      {friend.email}
                    </p>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </section>
  );
};