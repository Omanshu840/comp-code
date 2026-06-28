import { supabase } from '@/lib/supabase-client';

export type PendingFriendRequest = {
  id: string;
  requester_id: string;
  addressee_id: string;
  status: 'pending' | 'accepted' | 'rejected'; // Assuming these are the possible statuses
  created_at: string;
  requester_email: string;
  requester_full_name: string;
  requester_avatar_url: string | null;
};

export type FriendWithStreak = {
  friend_id: string;
  friend_email: string;
  friend_full_name: string | null;
  friend_avatar_url: string | null;
  my_streak: number;
  friend_streak: number;
  streak_difference: number;        // + = friend ahead, - = I'm ahead
  streak_status: 'both_on_fire' | 'you_are_ahead' | 'friend_is_ahead' | 'both_cold';
  friend_solved_today: boolean;
  i_solved_today: boolean;
  both_solved_today: boolean;
  combined_streak: number;
};


export const getUserByEmail = async (email: string) => {
  const { data, error } = await supabase
    .from('user_profiles')
    .select('id')
    .eq('email', email)
    .single();

  if (error) {
    console.error('Error getting user by email:', error);
    throw error;
  }

  return data;
};

export const sendFriendRequest = async ({ requester_id, addressee_id }: { requester_id: string; addressee_id: string }) => {
  const { data, error } = await supabase.from('friendships').insert({
    requester_id,
    addressee_id,
  });

  if (error) {
    console.error('Error sending friend request:', error);
    throw error;
  }

  return data;
};

export const acceptFriendRequest = async (friendshipId: string) => {
  const { data, error } = await supabase
    .from('friendships')
    .update({ status: 'accepted', updated_at: new Date().toISOString() })
    .eq('id', friendshipId);

  if (error) {
    console.error('Error accepting friend request:', error);
    throw error;
  }

  return data;
};

export const getFriends = async (currentUserId: string): Promise<FriendWithStreak[]> => {
  const { data, error } = await supabase
    .rpc('get_friends_with_streaks', { current_user_id: currentUserId });

  if (error) {
    console.error('Error getting friends with streaks:', error);
    throw error;
  }

  return data;
};

export const getPendingFriendRequests = async (currentUserId: string): Promise<PendingFriendRequest[] | null> => {
  const { data, error } = await supabase
    .from('pending_friend_requests')
    .select('*')
    .eq('addressee_id', currentUserId);

  if (error) {
    console.error('Error fetching pending requests:', error);
    throw error;
  }

  return data as PendingFriendRequest[] | null;
};

export const getSentFriendRequests = async (currentUserId: string) => {
  const { data, error } = await supabase
    .from('sent_friend_requests')
    .select('*')
    .eq('requester_id', currentUserId);
 
  if (error) {
    console.error('Error fetching sent requests:', error);
    throw error;
  }
 
  return data;
  // Shape:
  // {
  //   id, requester_id, addressee_id, status, created_at,
  //   addressee_email, addressee_full_name, addressee_avatar_url
  // }[]
};
 
 
// ─── Decline a friend request ────────────────────────────────────────────────
export const declineFriendRequest = async (friendshipId: string) => {
  const { error } = await supabase
    .from('friendships')
    .update({ status: 'declined' })
    .eq('id', friendshipId);
 
  if (error) {
    console.error('Error declining friend request:', error);
    throw error;
  }
};