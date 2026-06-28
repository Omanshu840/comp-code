import { useSentFriendRequests } from '../hooks/use-friends';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Clock } from 'lucide-react';

export function SentRequestsList() {
  const { data: sent, isLoading } = useSentFriendRequests();

  if (isLoading || !sent?.length) return null;

  return (
    <section>
      <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        Pending — waiting on them
      </h2>

      <div className="space-y-2">
        {sent.map((req) => {
          const name = req.addressee_full_name || req.addressee_email || 'Unknown';
          const initials = name[0].toUpperCase();

          return (
            <div
              key={req.id}
              className="flex items-center gap-3 px-3 py-2.5 rounded-xl border border-border bg-card"
            >
              <Avatar className="w-9 h-9 shrink-0">
                <AvatarImage src={req.addressee_avatar_url ?? undefined} />
                <AvatarFallback className="text-sm font-medium bg-muted text-muted-foreground">
                  {initials}
                </AvatarFallback>
              </Avatar>

              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate leading-tight">
                  {req.addressee_full_name || req.addressee_email}
                </p>
                {req.addressee_full_name && (
                  <p className="text-xs text-muted-foreground truncate">
                    {req.addressee_email}
                  </p>
                )}
              </div>

              <div className="flex items-center gap-1 shrink-0">
                <Clock className="w-3 h-3 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Pending</span>
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}