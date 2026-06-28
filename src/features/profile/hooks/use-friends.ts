import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import {
  getFriends,
  getPendingFriendRequests,
  sendFriendRequest,
  acceptFriendRequest,
  getUserByEmail,
  getSentFriendRequests,
  declineFriendRequest,
} from '../api/friends';
import { useAuth } from '@/features/auth/hooks/useAuth'; // Updated import

const STALE_TIME_MS = 5 * 60 * 1000 // 5 minutes

export const useFriends = () => {
  const { session } = useAuth(); // Get session from useAuth
  const userId = session?.user?.id; // Extract userId from session

  return useQuery({
    queryKey: ['friends', userId],
    queryFn: () => getFriends(userId!),
    staleTime: STALE_TIME_MS,
    enabled: !!userId,
  });
};

export const usePendingFriendRequests = () => {
  const { session } = useAuth(); // Get session from useAuth
  const userId = session?.user?.id; // Extract userId from session

  return useQuery({
    queryKey: ['pending-friend-requests', userId],
    queryFn: () => getPendingFriendRequests(userId!),
    staleTime: STALE_TIME_MS,
    enabled: !!userId,
  });
};

// ─── Sent requests (outgoing, still pending) ─────────────────────────────────
export const useSentFriendRequests = () => {
  const { session } = useAuth();
  const userId = session?.user?.id;
 
  return useQuery({
    queryKey: ['friend-requests', 'sent', userId],
    queryFn: () => getSentFriendRequests(userId!),
    staleTime: STALE_TIME_MS,
    enabled: !!userId,
  });
};
 
// ─── Decline an incoming request ─────────────────────────────────────────────
export const useDeclineFriendRequest = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth();
  const userId = session?.user?.id;
 
  return useMutation({
    mutationFn: (friendshipId: string) => declineFriendRequest(friendshipId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['friend-requests', 'pending', userId] });
    },
  });
};

export const useSendFriendRequest = () => {
  const queryClient = useQueryClient();
  const { session } = useAuth(); // Get session from useAuth
  const userId = session?.user?.id; // Extract userId from session

  return useMutation({
    mutationFn: async (addresseeEmail: string) => {
      if (!userId) throw new Error('User not logged in');

      // 1. Get user ID from email
      const addressee = await getUserByEmail(addresseeEmail);
      if (!addressee) throw new Error('User not found');

      // 2. Send the request
      return sendFriendRequest({ requester_id: userId, addressee_id: addressee.id });
    },
    onSuccess: () => {
      // Invalidate relevant queries to refetch data
      queryClient.invalidateQueries({ queryKey: ['friend-requests', 'sent', userId] });
    },
  });
};

export const useAcceptFriendRequest = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (friendshipId: string) => acceptFriendRequest(friendshipId),
    onSuccess: () => {
      // Invalidate and refetch friends and pending requests
      queryClient.invalidateQueries({ queryKey: ['friends'] });
      queryClient.invalidateQueries({ queryKey: ['pending-friend-requests'] });
    },
  });
};
