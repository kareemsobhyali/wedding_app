/**
 * Normalizes phone numbers, specifically catering to Egyptian formats while 
 * falling back to basic sanitization for international numbers.
 * 
 * Rules for Egypt:
 * 1. Remove all spaces, dashes, and parentheses.
 * 2. If it starts with '01', assume it's a local Egyptian number and prepend '+2'.
 * 3. If it starts with '201', assume it's missing the '+' and prepend it.
 * 4. Otherwise, just ensure it starts with '+' if it's international, or leave it sanitized.
 */
export function normalizePhoneNumber(phone: string): string {
  if (!phone) return phone;
  
  // 1. Sanitize: Keep only digits and '+'
  let sanitized = phone.replace(/[^\d+]/g, '');

  // 2. Egypt local format: 01xxxxxxxxx
  if (sanitized.startsWith('01') && sanitized.length === 11) {
    return `+2${sanitized}`;
  }

  // 3. Egypt country code without +: 201xxxxxxxxx
  if (sanitized.startsWith('201') && sanitized.length === 12) {
    return `+${sanitized}`;
  }

  // 4. Default: just return sanitized (assuming it's either correctly formatted or foreign)
  return sanitized;
}
