import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type VirtualCardRow = Record<string, unknown>;

export function useVirtualCard(userId: string) {
  return useQuery({
    queryKey: ['virtualCard', userId],
    queryFn: async (): Promise<VirtualCardRow | null> => {
      const { data, error } = await supabase
        .from('virtual_cards')
        .select('*')
        .eq('user_id', userId)
        .maybeSingle();

      if (error) throw error;
      return data;
    },
    enabled: Boolean(userId),
  });
}
