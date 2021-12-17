import {
  IAppointment,
  IAppointmentGroupByDate
} from '../../../types/appointment-types';
import { splitAppointmentsByDays } from '../../../helpers/appointments-helpers';

export const headers = [
  {
    key: 'name',
    header: '__'
  },
  {
    key: 'cash',
    header: 'Наличные'
  },
  {
    key: 'cashless',
    header: 'Терминал'
  }
];

export const revenueTableHeaders = [
  {
    key: 'date',
    header: 'Дата'
  },
  {
    key: 'cash',
    header: 'Наличные'
  },
  {
    key: 'cashless',
    header: 'Терминал'
  }
];

export interface IRevenueTableRow {
  id: string;
  date: string;
  cash: number;
  cashless: number;
}

export const makeRevenueRows = (
  appointmentsByDays: IAppointmentGroupByDate[]
): IRevenueTableRow[] => {
  const earningsByDays = appointmentsByDays.map(({ date, appointments }) => {
    const splitDateString = date.split('-');
    const formattedDate = `${splitDateString[2]}.${splitDateString[1]}`;
    const res = appointments.reduce(
      (acc, { cash, cashless }) => {
        acc.cash += cash || 0;
        acc.cashless += cashless || 0;
        return acc;
      },
      { cash: 0, cashless: 0 }
    );
    return {
      id: date,
      date: formattedDate,
      cash: res.cash,
      cashless: res.cashless
    };
  });
  return earningsByDays.map((earning) => ({
    id: earning.date,
    date: earning.date,
    cash: earning.cash,
    cashless: earning.cashless
  }));
};

export interface ITotalEarnings {
  cashTotal: number;
  cashlessTotal: number;
}

export function calculateTotalEarnings(
  appointments: IAppointment[]
): ITotalEarnings {
  let cashTotal = 0;
  let cashlessTotal = 0;
  appointments.forEach(({ cash, cashless }) => {
    cashTotal += cash || 0;
    cashlessTotal += cashless || 0;
  });
  return { cashTotal, cashlessTotal };
}
