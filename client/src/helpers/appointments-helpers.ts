import {IAppointment} from "../types/appointment-types";

export function mapDaysBetweenDates(startDateTimestamp: number, endDateTimestamp: number): IMappedDaysWithAppointments {
    const daysBetweenDates: IMappedDaysWithAppointments = {};
    let currentDateTimestamp = startDateTimestamp;

    while (currentDateTimestamp <= endDateTimestamp) {
        const day = new Date(currentDateTimestamp);
        const fullDateName = `${day.getFullYear()}_${day.getMonth()}_${day.getDate()}`;
        daysBetweenDates[fullDateName] = [];
        currentDateTimestamp += 86400000;
    }

    return daysBetweenDates;
}

interface IMappedDaysWithAppointments {
    [key: string]: IAppointment[];
}

export function splitAppointmentsByDays(appointments: IAppointment[], startDayTimestamp: number | string, endDayTimestamp: number | string): IMappedDaysWithAppointments {

    const daysToMap: IMappedDaysWithAppointments = mapDaysBetweenDates(+startDayTimestamp, +endDayTimestamp);
    appointments.forEach(appointment => {
        const date = new Date(Number(appointment.date));
        const fullDateName = `${date.getFullYear()}_${date.getMonth()}_${date.getDate()}`;
        daysToMap[fullDateName]?.push(appointment);

    });

    return daysToMap;
}
