export type GreetingPeriod = 'morning' | 'afternoon' | 'evening';

export function getGreetingPeriod(date: Date = new Date()): GreetingPeriod {
  const hour = date.getHours();

  if (hour < 12) {
    return 'morning';
  }

  if (hour < 17) {
    return 'afternoon';
  }

  return 'evening';
}

export function getGreeting(firstName: string, date: Date = new Date()): string {
  const period = getGreetingPeriod(date);

  const labels: Record<GreetingPeriod, string> = {
    morning: 'Good Morning',
    afternoon: 'Good Afternoon',
    evening: 'Good Evening',
  };

  return `${labels[period]}, ${firstName}`;
}
