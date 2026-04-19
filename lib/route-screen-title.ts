/**
 * Human-readable titles for the current route. Used by the global screen header
 * and (on web) the document title.
 */
const ROUTE_TITLES: Record<string, string> = {
  '/event/welcome': 'Vitaj',
  '/event/setup': 'Nový event',
  '/event/invite': 'Pozvi priateľov',
  '/event/wallet': 'Google Peňaženka',
  '/event/dashboard': 'Prehľad',
  '/event/members': 'Členovia',
  '/event/stats': 'Všetky výdavky',
  '/event/card-success': 'Karta',
  '/event/member-card-settings': 'Virtuálna karta',
};

function humanizeSegment(segment: string): string {
  const cleaned = segment.replace(/[-_]+/g, ' ').trim();
  if (!cleaned) return '';
  return cleaned.replace(/\b\w/g, (c) => c.toUpperCase());
}

export function getRouteTitle(pathname: string | undefined): string {
  if (!pathname || pathname === '/') {
    return 'Event';
  }

  const normalized = pathname.replace(/\/+$/, '') || '/';
  const mapped = ROUTE_TITLES[normalized];
  if (mapped) return mapped;

  const segments = normalized.split('/').filter(Boolean);
  const last = segments[segments.length - 1];
  if (last && /^\[.*\]$/.test(last)) {
    return 'Event';
  }
  return last ? humanizeSegment(last) : 'Event';
}
