export interface IAppointment {
    _id: string;
    client: string;
    date: Date;
    instagram: string | null;
    procedure: string;
    description: string | null;
    employee: {
        _id: string
    }
    status: string;
    paymentMethod: string | null;
    cash: number | null;
    cashless: number | null;
}

export interface IAppointmentGroup {
    _id: {
        count: number
        appointments: IAppointment[]
    }
}

export interface IAppointmentGroupByDate {
    date: string;
    appointments: IAppointment[];
}

export interface IAppointmentGroupByDateQuery {
    getAppointmentsByDate: IAppointmentGroupByDate[]
}
