export interface IAppointment {
  _id: string;
  client: string;
  price: number | null;
  date: Date;
  instagram: string | null;
  procedure: string;
  description: string | null;
  employee: {
    _id: string
  };
}

export interface BookTableRow {
  id: string;
  client: string;
  date: string;
  procedure: string;
  description: string | null;
  instagram: string | null;
  timestamp: Date;
  employee: {
    _id: string
  };
}

export const headers = [
  {
    key: 'date',
    header: 'Время'
  },
  {
    key: 'client',
    header: 'Имя'
  },
  {
    key: 'procedure',
    header: 'Процедура'
  }
];

export function makeRows(appointments: IAppointment[]): BookTableRow[] {
  return appointments.map(appointment => {
      const date = new Date(Number(appointment.date));
      const hours = date.getHours();
      const minutes = `${date.getMinutes()}`.padStart(2, '0');
      const time = hours + ':' + minutes;
      return {
        id: appointment._id,
        date: time,
        client: appointment.client,
        procedure: appointment.procedure,
        description: appointment.description,
        instagram: appointment.instagram,
        timestamp: appointment.date,
        employee: appointment.employee
      };
    }
  );
}

export function getDayName(dateString: string): string | Date {
  const dateArr = dateString.split('_');
  const date = new Date(+dateArr[0], +dateArr[1], +dateArr[2]);
  const dayName = ['Воскресенье', 'Понедельник', 'Вторник', 'Среда', 'Четверг', 'Пятница', 'Суббота'][date.getDay()];
  const monthName = ['января', 'февраля', 'марта', 'апреля', 'мая', 'июня', 'июля', 'августа', 'сентября', 'октября', 'ноября', 'декабря'][date.getMonth()];
  const day = date.getDate() + ' ' + monthName + ', ' + dayName;
  return String(day);
}

export function splitAppointmentsByDays(appointments: IAppointment[], startDayTimestamp: number | string, endDayTimestamp: number | string): IAppointment[][] {

  const daysToMap = mapDaysBetweenDates(+startDayTimestamp, +endDayTimestamp);
  appointments.forEach(appointment => {
    const date = new Date(Number(appointment.date));
    const fullDateName = `${date.getFullYear()}_${date.getMonth()}_${date.getDate()}`;
    daysToMap[fullDateName]?.push(appointment);

  });

  return daysToMap;
}


export const dateToTimestamp = (year: number, month: number, day: number, hours: number = 0, minutes: number = 0): number => {
  const date = new Date(year, month, day, hours, minutes);
  return date.getTime();
};


function mapDaysBetweenDates(startDateTimestamp: number, endDateTimestamp: number) {
  const daysBetweenDates: any = {};
  let currentDateTimestamp = startDateTimestamp;

  while (currentDateTimestamp <= endDateTimestamp) {
    const day = new Date(currentDateTimestamp);
    const fullDateName = `${day.getFullYear()}_${day.getMonth()}_${day.getDate()}`;
    daysBetweenDates[fullDateName] = [];
    currentDateTimestamp += 86400000;
  }

  return daysBetweenDates;
}

export function currentMonthFirstAndListDayTimestamp(): { firstDayTimestamp: number, lastDayTimestamp: number } {
  const date = new Date();
  const firstDayTimestamp = dateToTimestamp(date.getFullYear(), date.getMonth(), 1);
  const lastDayTimestamp = dateToTimestamp(date.getFullYear(), date.getMonth() + 1, 0);
  return { firstDayTimestamp, lastDayTimestamp };
}


export function mapTimeToTimepicker() {
  const times = [];
  for (let i = 8; i <= 20; i++) {
    times.push(`${i}:00`);
    times.push(`${i}:15`);
    times.push(`${i}:30`);
    times.push(`${i}:45`);
  }
  return times;
}
