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

export function formatDate(dateAux) {
  const date = new Date(dateAux);
  const day = String(date.getDate()).padStart(2, "0");
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const year = date.getFullYear();
  const hours = String(date.getHours()).padStart(2, "0");
  const minutes = String(date.getMinutes()).padStart(2, "0");

  return `${day}/${month}/${year} - ${hours}:${minutes}`;
}
