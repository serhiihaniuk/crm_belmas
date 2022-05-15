export interface IGetEmployeesQuery {
    getEmployees: IEmployee[];
}

export type IEmployeeId = string;
export type IEmployeeName = string;
export type IEmployeePosition = string;
export type IEmployeeQualification = string;
export type IRoles = 'admin' | 'root' | 'master';
export type IEmployeeRole = IRoles[];
export type IEmployeeLogin = string;

export interface IGetEmployees {
    getEmployees: IEmployee[];
}

export interface IEmployee {
    name: IEmployeeName;
    _id: IEmployeeId;
    position: IEmployeePosition;
    qualification: IEmployeeQualification;
    role: IEmployeeRole;
    login: IEmployeeLogin;
    password: string | null;
}