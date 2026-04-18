import { useQuery, useQueryClient } from '@tanstack/react-query';
import { useEffect } from 'react';

import { supabase } from '@/lib/supabase';

export type BalanceRow = Record<string, unknown>;

export function useBalances(potId: string) {
  const queryClient = useQueryClient();

  const query = useQuery({
    queryKey: ['balances', potId],
    queryFn: async (): Promise<BalanceRow[]> => {
      const { data, error } = await supabase
        .from('balances')
        .select('*')
        .eq('pot_id', potId);

      if (error) throw error;
      return data ?? [];
    },
    enabled: Boolean(potId),
  });

  useEffect(() => {
    if (!potId) return;

    const channel = supabase
      .channel(`balances:${potId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'balances',
          filter: `pot_id=eq.${potId}`,
        },
        () => {
          void queryClient.invalidateQueries({ queryKey: ['balances', potId] });
        },
      )
      .subscribe();

    return () => {
      void supabase.removeChannel(channel);
    };
  }, [potId, queryClient]);

  return { data: query.data, isLoading: query.isLoading, error: query.error };
}
