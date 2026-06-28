
import { useAuth } from '@/features/auth/hooks/useAuth';
import { supabase } from '@/lib/supabase-client';
import { useMutation } from '@tanstack/react-query';

export function useProfile() {
  const { session } = useAuth();

  const profile = session?.user?.user_metadata;

  const updateProfileMutation = useMutation({
    mutationFn: async (updates: { username: string; full_name: string }) => {
      if (!session?.user) throw new Error('User not authenticated');
      
      const { data, error } = await supabase.auth.updateUser({
        data: updates,
      });

      if (error) {
        throw error;
      }
      return data;
    },
  });

  return { profile, updateProfile: updateProfileMutation.mutateAsync, isLoading: !session };
}
