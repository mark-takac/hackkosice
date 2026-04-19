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

export type TripSummary = {
  id: string;
  name: string;
};

type TripData = {
  id: string;
  viewerContributorId: string;
  eventName: string;
  inviteCode: string;
  balanceEur: number;
  transactions: TransactionMock[];
  categories: CategorySlice[];
  contributors: ContributorMock[];
  joinedViaCode: boolean;
  cardPaymentsOffByContributorId: Record<string, boolean>;
  viewerExpenseAlertsEnabled: boolean;
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

function createTripId() {
  return `trip_${Math.random().toString(36).slice(2, 11)}`;
}

function tripFromDraft(name: string): TripData {
  return {
    id: createTripId(),
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
  };
}

function tripFromJoined(code: string): TripData {
  return {
    id: createTripId(),
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

type EventFlowState = {
  userFirstName: string;
  trips: TripData[];
  activeTripId: string;
};

type ActiveTripSlice = {
  activeTripId: string;
  viewerContributorId: string;
  eventName: string;
  inviteCode: string;
  balanceEur: number;
  transactions: TransactionMock[];
  categories: CategorySlice[];
  contributors: ContributorMock[];
  joinedViaCode: boolean;
  cardPaymentsOffByContributorId: Record<string, boolean>;
  viewerExpenseAlertsEnabled: boolean;
};

const EMPTY_ACTIVE: ActiveTripSlice = {
  activeTripId: '',
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

function sliceFromTrip(t: TripData): ActiveTripSlice {
  return {
    activeTripId: t.id,
    viewerContributorId: t.viewerContributorId,
    eventName: t.eventName,
    inviteCode: t.inviteCode,
    balanceEur: t.balanceEur,
    transactions: t.transactions,
    categories: t.categories,
    contributors: t.contributors,
    joinedViaCode: t.joinedViaCode,
    cardPaymentsOffByContributorId: t.cardPaymentsOffByContributorId,
    viewerExpenseAlertsEnabled: t.viewerExpenseAlertsEnabled,
  };
}

function getActiveSlice(state: EventFlowState): ActiveTripSlice {
  const trip = state.trips.find((t) => t.id === state.activeTripId);
  return trip ? sliceFromTrip(trip) : EMPTY_ACTIVE;
}

type EventFlowContextValue = ActiveTripSlice & {
  userFirstName: string;
  tripSummaries: TripSummary[];
  startEventDraft: (name: string) => void;
  seedJoinedFromCode: (code: string) => void;
  selectTrip: (tripId: string) => void;
  splitCurrentTrip: () => void;
  removeContributor: (id: string) => void;
  setContributorCardPaymentsOff: (contributorId: string, paymentsOff: boolean) => void;
  setViewerExpenseAlertsEnabled: (enabled: boolean) => void;
};

const EventFlowContext = createContext<EventFlowContextValue | null>(null);

const initialState: EventFlowState = {
  userFirstName: DEFAULT_USER,
  trips: [],
  activeTripId: '',
};

function updateActiveTrip(state: EventFlowState, updater: (trip: TripData) => TripData): EventFlowState {
  const idx = state.trips.findIndex((t) => t.id === state.activeTripId);
  if (idx === -1) return state;
  const nextTrips = [...state.trips];
  nextTrips[idx] = updater(nextTrips[idx]);
  return { ...state, trips: nextTrips };
}

export function EventFlowProvider({ children }: PropsWithChildren) {
  const [state, setState] = useState<EventFlowState>(initialState);

  const startEventDraft = useCallback((name: string) => {
    const trip = tripFromDraft(name);
    setState((prev) => ({
      ...prev,
      trips: [...prev.trips, trip],
      activeTripId: trip.id,
    }));
  }, []);

  const seedJoinedFromCode = useCallback((code: string) => {
    const trip = tripFromJoined(code);
    setState((prev) => ({
      ...prev,
      trips: [...prev.trips, trip],
      activeTripId: trip.id,
    }));
  }, []);

  const selectTrip = useCallback((tripId: string) => {
    setState((prev) => (prev.trips.some((t) => t.id === tripId) ? { ...prev, activeTripId: tripId } : prev));
  }, []);

  const splitCurrentTrip = useCallback(() => {
    setState((prev) => {
      if (!prev.activeTripId) return prev;
      const nextTrips = prev.trips.filter((t) => t.id !== prev.activeTripId);
      return {
        ...prev,
        trips: nextTrips,
        activeTripId: nextTrips[0]?.id ?? '',
      };
    });
  }, []);

  const removeContributor = useCallback((id: string) => {
    setState((prev) =>
      updateActiveTrip(prev, (trip) => {
        if (trip.contributors.length <= 1) return trip;
        const next = trip.contributors.filter((c) => c.id !== id);
        let viewerContributorId = trip.viewerContributorId;
        if (id === viewerContributorId || !next.some((c) => c.id === viewerContributorId)) {
          viewerContributorId = next[0]?.id ?? '';
        }
        const cardPaymentsOffByContributorId = { ...trip.cardPaymentsOffByContributorId };
        delete cardPaymentsOffByContributorId[id];
        return { ...trip, contributors: next, viewerContributorId, cardPaymentsOffByContributorId };
      }),
    );
  }, []);

  const setContributorCardPaymentsOff = useCallback((contributorId: string, paymentsOff: boolean) => {
    setState((prev) =>
      updateActiveTrip(prev, (trip) => {
        const cardPaymentsOffByContributorId = { ...trip.cardPaymentsOffByContributorId };
        if (paymentsOff) cardPaymentsOffByContributorId[contributorId] = true;
        else delete cardPaymentsOffByContributorId[contributorId];
        return { ...trip, cardPaymentsOffByContributorId };
      }),
    );
  }, []);

  const setViewerExpenseAlertsEnabled = useCallback((enabled: boolean) => {
    setState((prev) => updateActiveTrip(prev, (trip) => ({ ...trip, viewerExpenseAlertsEnabled: enabled })));
  }, []);

  const value = useMemo<EventFlowContextValue>(() => {
    const active = getActiveSlice(state);
    const tripSummaries: TripSummary[] = state.trips.map((t) => ({
      id: t.id,
      name: t.eventName.trim() || 'Skupinový budget',
    }));
    return {
      userFirstName: state.userFirstName,
      tripSummaries,
      ...active,
      startEventDraft,
      seedJoinedFromCode,
      selectTrip,
      splitCurrentTrip,
      removeContributor,
      setContributorCardPaymentsOff,
      setViewerExpenseAlertsEnabled,
    };
  }, [
    state,
    startEventDraft,
    seedJoinedFromCode,
    selectTrip,
    splitCurrentTrip,
    removeContributor,
    setContributorCardPaymentsOff,
    setViewerExpenseAlertsEnabled,
  ]);

  return <EventFlowContext.Provider value={value}>{children}</EventFlowContext.Provider>;
}

export function useEventFlow() {
  const ctx = useContext(EventFlowContext);
  if (!ctx) {
    throw new Error('useEventFlow must be used within EventFlowProvider');
  }
  return ctx;
}
