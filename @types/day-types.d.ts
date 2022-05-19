import {DayCode} from "./date-types";
import {IAppointmentRaw} from "./appointment-types";
import {IEmployee} from "./employee-types";

export interface IDayRaw {
    _id: string;
    dayCode: DayCode;
    year: string;
    month: string;
    day: string;
    date: number;
    appointments: IAppointmentRaw[];
    dayOff: IDayOffRaw[];
    isOff?: true | null
}

export interface IDayOffRaw {
    _id: string;
    dayCode: DayCode;
    employee: IEmployee;
    day: IDayRaw;
}