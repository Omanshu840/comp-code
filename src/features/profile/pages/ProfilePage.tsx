import { useAuth } from '@/features/auth/hooks/useAuth';
import { useProfile } from '../hooks/use-profile';
import { type FormEvent, useEffect, useState } from 'react';
import { FriendRequestSearch } from '@/features/profile/components/FriendRequestSearch';
import { IncomingRequestsNotification } from '@/features/profile/components/IncomingRequestsNotification';
import { SentRequestsList } from '@/features/profile/components/SentRequestsList';
import { FriendsList } from '@/features/profile/components/FriendsList';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { LogOut, Pencil, Check, X } from 'lucide-react';

export function ProfilePage() {
  const { session, supabase } = useAuth();
  const { profile, isLoading, updateProfile } = useProfile();
  const [username, setUsername] = useState('');
  const [fullName, setFullName] = useState('');
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

  useEffect(() => {
    if (profile) {
      setUsername(profile.username || '');
      setFullName(profile.full_name || '');
    }
  }, [profile]);

  const handleSave = async (e: FormEvent) => {
    e.preventDefault();
    if (!session?.user) return;
    setIsSaving(true);
    try {
      await updateProfile({ username, full_name: fullName });
      setIsEditing(false);
    } catch (error) {
      console.error(error);
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    if (profile) {
      setUsername(profile.username || '');
      setFullName(profile.full_name || '');
    }
    setIsEditing(false);
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  const getInitials = () => {
    if (fullName) {
      return fullName
        .split(' ')
        .map((n) => n[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return session?.user?.email?.[0]?.toUpperCase() ?? '?';
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="w-8 h-8 border-2 border-border border-t-foreground rounded-full animate-spin" />
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-screen p-4">
        <p className="text-muted-foreground text-sm">Could not load profile.</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header hero */}
      <div className="bg-card border-b border-border px-4 pt-12 pb-6">
        <div className="flex items-start justify-between mb-4">
          <Avatar className="w-16 h-16 border-2 border-border">
            <AvatarImage src={session?.user?.user_metadata?.avatar_url} />
            <AvatarFallback className="text-lg font-medium bg-muted text-muted-foreground">
              {getInitials()}
            </AvatarFallback>
          </Avatar>

          <div className="flex items-center gap-2">
            {!isEditing ? (
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setIsEditing(true)}
                className="rounded-full h-9 w-9"
              >
                <Pencil className="w-4 h-4" />
              </Button>
            ) : null}
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="rounded-full h-9 w-9 text-destructive hover:text-destructive hover:bg-destructive/10"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        </div>

        {!isEditing ? (
          <div>
            <h1 className="text-xl font-semibold text-foreground leading-tight">
              {fullName || username || 'No name set'}
            </h1>
            {username && (
              <p className="text-sm text-muted-foreground mt-0.5">@{username}</p>
            )}
            <p className="text-sm text-muted-foreground mt-0.5">
              {session?.user?.email}
            </p>
          </div>
        ) : (
          <form onSubmit={handleSave} className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="fullName" className="text-xs text-muted-foreground">
                Full name
              </Label>
              <Input
                id="fullName"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Your full name"
                className="h-9"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="username" className="text-xs text-muted-foreground">
                Username
              </Label>
              <Input
                id="username"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="username"
                className="h-9"
              />
            </div>
            <div className="flex gap-2 pt-1">
              <Button
                type="submit"
                size="sm"
                disabled={isSaving}
                className="flex-1 gap-1.5"
              >
                <Check className="w-3.5 h-3.5" />
                {isSaving ? 'Saving…' : 'Save changes'}
              </Button>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={handleCancel}
                className="gap-1.5"
              >
                <X className="w-3.5 h-3.5" />
                Cancel
              </Button>
            </div>
          </form>
        )}
      </div>

      {/* Body */}
      <div className="px-4 py-5 space-y-6">
        {/* Incoming requests — notification style */}
        <IncomingRequestsNotification />

        {/* Add a friend */}
        <section>
          <h2 className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
            Add a friend
          </h2>
          <FriendRequestSearch />
        </section>

        {/* Sent requests */}
        <SentRequestsList />

        <Separator />

        {/* Friends */}
        <FriendsList />
      </div>
    </div>
  );
}