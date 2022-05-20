import {IEmployee} from "../../../../@types/employee-types";


export enum EmployeeActionTypes {
    SET_EMPLOYEE = 'SET_EMPLOYEE'
}

export interface IEmployeeState extends IEmployee {
    isAuth: boolean;
}

export interface ISetEmployeeAction {
    type: EmployeeActionTypes.SET_EMPLOYEE;
    payload: IEmployeeState;
}

const initialState: IEmployeeState = {
    _id: '',
    name: '',
    position: '',
    qualification: '',
    role: [],
    occupation: 'none',
    login: '',
    isAuth: false
};

export const employeeReducer = (state = initialState, action: ISetEmployeeAction): IEmployeeState => {
    switch (action.type) {
        case EmployeeActionTypes.SET_EMPLOYEE:
            return {
                ...state,
                ...action.payload
            };
        default:
            return state;
    }
};
