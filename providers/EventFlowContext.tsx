import type { PropsWithChildren } from 'react';
import { createContext, useCallback, useContext, useMemo, useState } from 'react';

export type TransactionMock = {
  id: string;
  merchant: string;
  amountEur: number;
  dateLabel: string;
  initials: string;
  tint: string;
};

export type CategorySlice = {
  key: string;
  label: string;
  amountEur: number;
  color: string;
};

export type ContributorMock = {
  id: string;
  name: string;
  amountEur: number;
  initials: string;
  color: string;
};

const DEFAULT_USER = 'Mark';

const MOCK_JOINED_NAME = 'Výlet do Tatier';
const MOCK_JOINED_BALANCE = 200;

const MOCK_TRANSACTIONS: TransactionMock[] = [
  {
    id: '1',
    merchant: 'Tesco',
    amountEur: 50,
    dateLabel: '12. 4.',
    initials: 'M',
    tint: '#009fe3',
  },
  {
    id: '2',
    merchant: 'Shell',
    amountEur: 35,
    dateLabel: '11. 4.',
    initials: 'J',
    tint: '#eab308',
  },
  {
    id: '3',
    merchant: 'Koliba',
    amountEur: 42,
    dateLabel: '10. 4.',
    initials: 'A',
    tint: '#a855f7',
  },
];

const MOCK_CATEGORIES: CategorySlice[] = [
  { key: 'potraviny', label: 'Potraviny', amountEur: 50, color: '#009fe3' },
  { key: 'palivo', label: 'Palivo', amountEur: 35, color: '#22c55e' },
  { key: 'restauracie', label: 'Reštaurácie', amountEur: 42, color: '#d4af37' },
  { key: 'ostatne', label: 'Ostatné', amountEur: 18, color: '#71717a' },
];

const MOCK_CONTRIBUTORS: ContributorMock[] = [
  { id: '1', name: 'Ty', amountEur: 80, initials: 'M', color: '#009fe3' },
  { id: '2', name: 'Jana', amountEur: 60, initials: 'J', color: '#22c55e' },
  { id: '3', name: 'Adam', amountEur: 40, initials: 'A', color: '#d4af37' },
  { id: '4', name: 'Petra', amountEur: 20, initials: 'P', color: '#a855f7' },
];

function randomCode() {
  const part = () => Math.random().toString(36).slice(2, 6).toUpperCase();
  return `TB-${part()}`;
}

type EventFlowState = {
  userFirstName: string;
  /** Contributor row representing the signed-in user (for „tvoja karta“ UI). */
  viewerContributorId: string;
  eventName: string;
  inviteCode: string;
  balanceEur: number;
  transactions: TransactionMock[];
  categories: CategorySlice[];
  contributors: ContributorMock[];
  joinedViaCode: boolean;
  /** When true, platby touto virtuálnou kartou sú vypnuté (per člen). */
  cardPaymentsOffByContributorId: Record<string, boolean>;
  /** Push / upozornenia len pre kartu diváka (demo). */
  viewerExpenseAlertsEnabled: boolean;
};

type EventFlowContextValue = EventFlowState & {
  startEventDraft: (name: string) => void;
  seedJoinedFromCode: (code: string) => void;
  removeContributor: (id: string) => void;
  setContributorCardPaymentsOff: (contributorId: string, paymentsOff: boolean) => void;
  setViewerExpenseAlertsEnabled: (enabled: boolean) => void;
};

const EventFlowContext = createContext<EventFlowContextValue | null>(null);

const initialState: EventFlowState = {
  userFirstName: DEFAULT_USER,
  viewerContributorId: '',
  eventName: '',
  inviteCode: '',
  balanceEur: 0,
  transactions: [],
  categories: [],
  contributors: [],
  joinedViaCode: false,
  cardPaymentsOffByContributorId: {},
  viewerExpenseAlertsEnabled: true,
};

function joinedPayload(code: string): EventFlowState {
  return {
    userFirstName: DEFAULT_USER,
    viewerContributorId: MOCK_CONTRIBUTORS[0]?.id ?? '',
    eventName: MOCK_JOINED_NAME,
    inviteCode: code.trim().toUpperCase(),
    balanceEur: MOCK_JOINED_BALANCE,
    transactions: MOCK_TRANSACTIONS,
    categories: MOCK_CATEGORIES,
    contributors: MOCK_CONTRIBUTORS,
    joinedViaCode: true,
    cardPaymentsOffByContributorId: {},
    viewerExpenseAlertsEnabled: true,
  };
}

export function EventFlowProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<EventFlowState>(initialState);

  const startEventDraft = useCallback((name: string) => {
    setState({
      userFirstName: DEFAULT_USER,
      viewerContributorId: MOCK_CONTRIBUTORS[0]?.id ?? '',
      eventName: name.trim(),
      inviteCode: randomCode(),
      balanceEur: MOCK_JOINED_BALANCE,
      transactions: MOCK_TRANSACTIONS,
      categories: MOCK_CATEGORIES,
      contributors: MOCK_CONTRIBUTORS,
      joinedViaCode: false,
      cardPaymentsOffByContributorId: {},
      viewerExpenseAlertsEnabled: true,
    });
  }, []);

  const seedJoinedFromCode = useCallback((code: string) => {
    setState(joinedPayload(code));
  }, []);

  const removeContributor = useCallback((id: string) => {
    setState((prev) => {
      if (prev.contributors.length <= 1) return prev;
      const next = prev.contributors.filter((c) => c.id !== id);
      let viewerContributorId = prev.viewerContributorId;
      if (id === viewerContributorId || !next.some((c) => c.id === viewerContributorId)) {
        viewerContributorId = next[0]?.id ?? '';
      }
      const cardPaymentsOffByContributorId = { ...prev.cardPaymentsOffByContributorId };
      delete cardPaymentsOffByContributorId[id];
      return { ...prev, contributors: next, viewerContributorId, cardPaymentsOffByContributorId };
    });
  }, []);

  const setContributorCardPaymentsOff = useCallback((contributorId: string, paymentsOff: boolean) => {
    setState((prev) => {
      const cardPaymentsOffByContributorId = { ...prev.cardPaymentsOffByContributorId };
      if (paymentsOff) cardPaymentsOffByContributorId[contributorId] = true;
      else delete cardPaymentsOffByContributorId[contributorId];
      return { ...prev, cardPaymentsOffByContributorId };
    });
  }, []);

  const setViewerExpenseAlertsEnabled = useCallback((enabled: boolean) => {
    setState((prev) => ({ ...prev, viewerExpenseAlertsEnabled: enabled }));
  }, []);

  const value = useMemo<EventFlowContextValue>(
    () => ({
      ...state,
      startEventDraft,
      seedJoinedFromCode,
      removeContributor,
      setContributorCardPaymentsOff,
      setViewerExpenseAlertsEnabled,
    }),
    [
      state,
      startEventDraft,
      seedJoinedFromCode,
      removeContributor,
      setContributorCardPaymentsOff,
      setViewerExpenseAlertsEnabled,
    ],
  );

  return <EventFlowContext.Provider value={value}>{children}</EventFlowContext.Provider>;
}

export function useEventFlow() {
  const ctx = useContext(EventFlowContext);
  if (!ctx) {
    throw new Error('useEventFlow must be used within EventFlowProvider');
  }
  return ctx;
}
