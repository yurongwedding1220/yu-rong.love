/**
 * Public guest index placeholder for 政憲 & 幸容.
 * Fill in later if album name search is needed.
 */
export const PUBLIC_TABLE_NAMES: Record<number, string> = {};

type PublicGuestRow = readonly [
  name: string,
  side: string,
  relation: string,
  table: number | null,
];

export const PUBLIC_GUEST_ROWS: readonly PublicGuestRow[] = [];
