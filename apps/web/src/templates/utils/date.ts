export function formatEventDate(dateString: Date | string, direction: 'LTR' | 'RTL' = 'LTR'): string {
  if (!dateString) return '';
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return '';
    
    return new Intl.DateTimeFormat(direction === 'RTL' ? 'ar-EG' : 'en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    }).format(d);
  } catch {
    return '';
  }
}
