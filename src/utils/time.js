export function numberToTime(number) {
  const minutes = number % 60;
  const hours = (number - minutes) / 60;
  const paddedMinutes = minutes < 10 ? `0${minutes}` : minutes;
  const paddedHours = hours < 10 ? `0${hours}` : hours;
  return `${paddedHours}:${paddedMinutes}`;
}

export function numbersToWeeklySchedule(numbers) {
  const weekSchedule = Array.from({ length: 7 }, () => []);

  numbers?.forEach((number) => {
    const minutesInADay = 1440;
    const dayOfWeek = (number - (number % minutesInADay)) / minutesInADay;
    weekSchedule[dayOfWeek].push(number - dayOfWeek * minutesInADay);
  });

  return weekSchedule;
}

export const daysOfWeekDict = [
  "Segunda-feira",
  "Terça-feira",
  "Quarta-feira",
  "Quinta-feira",
  "Sexta-feira",
  "Sábado",
  "Domingo",
];
