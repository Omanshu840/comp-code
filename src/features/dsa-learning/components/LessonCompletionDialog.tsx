import { useMediaQuery } from "@/hooks/use-media-query"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Drawer,
  DrawerContent,
} from "@/components/ui/drawer"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Flame, Trophy } from "lucide-react"
import { useFriends } from "@/features/profile/hooks/use-friends"
import { type FriendWithStreak } from "@/features/profile/api/friends"
import { useDsaStreak } from "../hooks/use-progress"
import { Button } from "@/components/ui/button"

function StreakContent({
  personalStreak,
  friends,
  isLoading,
}: {
  personalStreak: number
  friends: FriendWithStreak[] | undefined
  isLoading: boolean
}) {
  return (
    <div className="p-4">
      <div className="flex items-center justify-center space-x-2">
        <Flame className="size-8 text-orange-500" />
        <span className="text-4xl font-bold">{personalStreak}</span>
      </div>
      <p className="text-center text-muted-foreground mt-2">
        You've extended your learning streak!
      </p>
      <div className="mt-6">
        <h3 className="text-lg font-semibold">Friends Streak</h3>
        <div className="mt-2 space-y-4">
          {isLoading ? (
            <p>Loading friends...</p>
          ) : friends && friends.length > 0 ? (
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
          ) : (
            <p className="text-muted-foreground text-center">No friends streaks to show yet.</p>
          )}
        </div>
      </div>
    </div>
  )
}

export function LessonCompletionDialog({
  isOpen,
  onClose,
  isStreakUpdated,
  problem,
}: {
  isOpen: boolean
  onClose: () => void
  isStreakUpdated: boolean
  problem: { problem_id: string; problem_name: string}
}) {
  const isDesktop = useMediaQuery("(min-width: 768px)")
  const { data: friends, isLoading } = useFriends()
  const { streak } = useDsaStreak()

  const handleOpenChange = (open: boolean) => {
    if (!open) {
      onClose()
    }
  }

  const content = (
    <div>
      <div className="text-center p-6">
        <div className="mx-auto grid size-24 place-items-center border border-foreground bg-lime-300 text-black shadow-[6px_6px_0_#000]">
          <Trophy className="size-12" />
        </div>
        <h1 className="mt-8 text-4xl font-semibold">Lesson Complete!</h1>
        <p className="mx-auto mt-3 max-w-md text-sm leading-6 text-muted-foreground">
          {problem.problem_name} is now marked complete on your path.
        </p>
      </div>
      {isStreakUpdated && (
        <StreakContent
          personalStreak={streak?.streak ?? 0}
          friends={friends}
          isLoading={isLoading}
        />
      )}
    </div>
  )

  if (isDesktop) {
    return (
      <Dialog open={isOpen} onOpenChange={handleOpenChange}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Lesson Complete!</DialogTitle>
          </DialogHeader>
          {content}
          <Button onClick={onClose} className="w-full">Done</Button>
        </DialogContent>
      </Dialog>
    )
  }

  return (
    <Drawer open={isOpen} onOpenChange={handleOpenChange} direction="right">
      <DrawerContent className="rounded-none !w-screen !max-w-none">
        <div className="flex-1 overflow-y-auto">
          {content}
        </div>
        <div className="p-4">
          <Button onClick={onClose} className="w-full">Done</Button>
        </div>
      </DrawerContent>
    </Drawer>
  )
}
