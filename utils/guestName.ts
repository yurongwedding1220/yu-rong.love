const MAX_GUEST_NAME_LENGTH = 20;

/** Decode, trim, and cap a ?to= guest name. Render the result as text only. */
export const parseGuestName = (raw: string | null | undefined): string | null => {
  if (!raw) return null;

  let name = raw.normalize('NFC');
  name = name.replace(/[\u0000-\u001F\u007F\u200B-\u200F\u202A-\u202E\u2060\uFEFF]/g, '');
  name = name.replace(/\s+/g, ' ').trim();
  if (!name) return null;

  name = Array.from(name).slice(0, MAX_GUEST_NAME_LENGTH).join('').trim();
  return name || null;
};
