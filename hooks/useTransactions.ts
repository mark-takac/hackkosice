import { useQuery } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type TransactionRow = Record<string, unknown>;

export function useTransactions(potId: string) {
  return useQuery({
    queryKey: ['transactions', potId],
    queryFn: async (): Promise<TransactionRow[]> => {
      const { data, error } = await supabase
        .from('transactions')
        .select('*')
        .eq('pot_id', potId)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return data ?? [];
    },
    enabled: Boolean(potId),
  });
}
