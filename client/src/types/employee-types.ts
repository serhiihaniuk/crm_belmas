export interface IGetEmployeesQuery {
    getEmployees: IEmployee[];
}

export interface IEmployee {
    name: string;
    _id: string;
    position: string;
    qualification: string;
    role: string;
    login: string;
}
