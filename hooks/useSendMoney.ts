import { useMutation, useQueryClient } from '@tanstack/react-query';

import { supabase } from '@/lib/supabase';

export type SendMoneyInput = {
  potId: string;
  fromUserId: string;
  toUserId: string;
  amount: number;
};

export function useSendMoney() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({ potId, fromUserId, toUserId, amount }: SendMoneyInput) => {
      const { data, error } = await supabase.rpc('create_transfer', {
        pot_id: potId,
        from_user_id: fromUserId,
        to_user_id: toUserId,
        amount,
      });

      if (error) throw error;
      return data;
    },
    onSuccess: (_data, { potId }) => {
      void queryClient.invalidateQueries({ queryKey: ['balances', potId] });
      void queryClient.invalidateQueries({ queryKey: ['transactions', potId] });
    },
  });
}
