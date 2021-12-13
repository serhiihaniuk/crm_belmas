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
    }
    status: string;
    paymentMethod: string | null;
}
