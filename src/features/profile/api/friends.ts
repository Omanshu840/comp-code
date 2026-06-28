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

export type FriendProfile = {
  id: string;
  email: string;
  full_name: string;
  avatar_url: string | null;
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

export const getFriends = async (currentUserId: string):Promise<FriendProfile[] | null> => {
  const { data, error } = await supabase
    .from('accepted_friends')
    .select('*')
    .or(`requester_id.eq.${currentUserId},addressee_id.eq.${currentUserId}`);

  if (error) {
    console.error('Error getting friendships:', error);
    throw error;
  }

  // Normalize so the "friend" is always the other person
  return data.map((f) => {
    const iAmRequester = f.requester_id === currentUserId;
    return {
      id: iAmRequester ? f.addressee_id : f.requester_id,
      email: iAmRequester ? f.addressee_email : f.requester_email,
      full_name: iAmRequester ? f.addressee_full_name : f.requester_full_name,
      avatar_url: iAmRequester ? f.addressee_avatar_url : f.requester_avatar_url,
    };
  });

  // Returned shape:
  // { id, email, full_name, avatar_url }[]
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