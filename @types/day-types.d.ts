import {DayCode} from "./date-types";
import {IAppointmentRaw} from "./appointment-typesd";
import {IEmployee} from "./employee-types";

export interface IDayRaw {
    _id: string;
    dayCode: DayCode;
    year: string;
    month: string;
    day: string;
    appointments: IAppointmentRaw[];
    dayOff: IDayOffRaw[];
}

export interface IDayOffRaw {
    _id: string;
    dayCode: DayCode;
    employee: IEmployee;
    day: IDayRaw;
}