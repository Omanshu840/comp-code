import { useState } from "react";
import { useMediaQuery } from "@/hooks/use-media-query";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Drawer,
  DrawerContent,
  DrawerTitle,
  DrawerTrigger,
} from "@/components/ui/drawer";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Flame } from "lucide-react";
import { useFriends } from "@/features/profile/hooks/use-friends";
import { type FriendWithStreak } from "@/features/profile/api/friends";

function StreakContent({
  personalStreak,
  friends,
  isLoading,
}: {
  personalStreak: number;
  friends: FriendWithStreak[] | undefined;
  isLoading: boolean;
}) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-center space-x-2">
        <Flame className="size-8 text-orange-500" />
        <span className="text-4xl font-bold">{personalStreak}</span>
      </div>
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Friends Streak</h3>
        <div className="mt-2 space-y-4">
          {isLoading ? (
            <p>Loading friends...</p>
          ) : (
            friends?.map((friend) => (
              <div
                key={friend.friend_id}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage
                      src={friend.friend_avatar_url ?? undefined}
                      alt={friend.friend_full_name ?? "Friend"}
                    />
                    <AvatarFallback>
                      {friend.friend_full_name?.[0] ?? friend.friend_email?.[0]}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-semibold">{friend.friend_full_name ?? friend.friend_email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <Flame className="size-5 text-orange-500" />
                  <span className="font-bold text-lg">{friend.combined_streak}</span>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

export function StreakDialog({
  personalStreak,
}: {
  personalStreak: number;
}) {
  const [open, setOpen] = useState(false);
  const isDesktop = useMediaQuery("(min-width: 768px)");
  const { data: friends, isLoading } = useFriends();

  const trigger = (
    <div className="flex items-center gap-2 cursor-pointer">
      <Flame className="size-5 text-orange-500" />
      <span className="font-bold text-lg">{personalStreak}</span>
    </div>
  );

  if (isDesktop) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger asChild>{trigger}</DialogTrigger>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Streak</DialogTitle>
          </DialogHeader>
          <StreakContent
            personalStreak={personalStreak}
            friends={friends}
            isLoading={isLoading}
          />
        </DialogContent>
      </Dialog>
    );
  }

  return (
    <Drawer open={open} onOpenChange={setOpen} direction="bottom">
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="h-[100dvh] max-h-[100dvh] rounded-none">
        
        <DrawerTitle className="text-center mt-4 text-lg">Streak</DrawerTitle>

        <div className="flex-1 overflow-y-auto">
          <StreakContent
            personalStreak={personalStreak}
            friends={friends}
            isLoading={isLoading}
          />
        </div>
      </DrawerContent>
    </Drawer>
  );
}
