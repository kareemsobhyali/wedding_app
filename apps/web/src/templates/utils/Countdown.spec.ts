import { calculateTimeLeft } from './Countdown';

describe('Countdown Logic', () => {
  beforeAll(() => {
    jest.useFakeTimers();
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('should calculate time left for future event', () => {
    const now = new Date(2026, 0, 1, 12, 0, 0);
    jest.setSystemTime(now);

    const targetDate = new Date(2026, 0, 2, 12, 0, 0);
    const result = calculateTimeLeft(targetDate);

    expect(result.days).toBe(1);
    expect(result.hours).toBe(0);
    expect(result.isPassed).toBe(false);
    expect(result.isToday).toBe(false);
  });

  it('should flag as today if event is happening today', () => {
    const now = new Date(2026, 0, 1, 12, 0, 0);
    jest.setSystemTime(now);

    const targetDate = new Date(2026, 0, 1, 18, 0, 0); // later today
    const result = calculateTimeLeft(targetDate);

    expect(result.isToday).toBe(true);
    expect(result.isPassed).toBe(false);
  });

  it('should flag as passed if event date is in the past and not today', () => {
    const now = new Date(2026, 0, 5, 12, 0, 0);
    jest.setSystemTime(now);

    const targetDate = new Date(2026, 0, 1, 12, 0, 0);
    const result = calculateTimeLeft(targetDate);

    expect(result.isPassed).toBe(true);
    expect(result.isToday).toBe(false);
    expect(result.days).toBe(0);
    expect(result.hours).toBe(0);
    expect(result.seconds).toBe(0); // No negative values
  });

  it('should respect exact time formatting', () => {
    const now = new Date(2026, 0, 1, 10, 0, 0); // 10:00 AM local
    jest.setSystemTime(now);

    const targetDate = new Date(2026, 0, 1, 0, 0, 0);
    const targetTime = '12:30'; // 12:30 PM local
    
    // Result should be 2 hours, 30 minutes
    const result = calculateTimeLeft(targetDate, targetTime);
    expect(result.hours).toBe(2);
    expect(result.minutes).toBe(30);
  });
});
