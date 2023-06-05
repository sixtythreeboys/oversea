export function getToday(): string {
  const date = new Date();

  const year = date.getFullYear().toString();
  const month = (date.getMonth() + 1).toString().padStart(2, '0');
  const day = date.getDate().toString().padStart(2, '0');

  return `${year}${month}${day}`;
}

export function getDateDiff(date1: string, date2: string): number {
  const year1 = parseInt(date1.substring(0, 4));
  const month1 = parseInt(date1.substring(4, 6)) - 1; // Month is zero-based
  const day1 = parseInt(date1.substring(6, 8));

  const year2 = parseInt(date2.substring(0, 4));
  const month2 = parseInt(date2.substring(4, 6)) - 1; // Month is zero-based
  const day2 = parseInt(date2.substring(6, 8));

  const diffTime = Math.abs(
    new Date(year2, month2, day2).getTime() -
      new Date(year1, month1, day1).getTime(),
  );
  const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  return diffDays;
}
