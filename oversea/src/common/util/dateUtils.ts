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

export function addOneDay(date: string): string {
  const year = Number(date.substring(0, 4));
  const month = Number(date.substring(4, 6)) - 1; // Subtract 1 from the month since it's zero-based in JavaScript Date object
  const day = Number(date.substring(6, 8));

  const currentDate = new Date(year, month, day);
  currentDate.setDate(currentDate.getDate() + 1);

  const newYear = currentDate.getFullYear();
  const newMonth = (currentDate.getMonth() + 1).toString().padStart(2, '0'); // Add 1 to the month and pad with leading zero if needed
  const newDay = currentDate.getDate().toString().padStart(2, '0'); // Pad the day with leading zero if needed

  return `${newYear}${newMonth}${newDay}`;
}

export function getDateList(start, end) {
  const res = [];
  [start, end] = [addOneDay(start), addOneDay(end)];
  for (let day = start; day !== end; day = addOneDay(day)) {
    res.push(day);
  }
  return res;
}

export function generateDateList(startDate: string, period: number): string[] {
  const dateArray: string[] = [];
  const currentDate = new Date(startDate);

  for (let i = 0; i < period; i++) {
    const year = currentDate.getFullYear();
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const formattedDate = `${year}${month}${day}`;
    dateArray.push(formattedDate);

    currentDate.setDate(currentDate.getDate() - 1); // Subtract one day from the current date
  }

  return dateArray.reverse();
}
