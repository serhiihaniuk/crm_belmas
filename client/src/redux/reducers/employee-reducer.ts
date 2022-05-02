export enum EmployeeActionTypes {
    SET_EMPLOYEE = 'SET_EMPLOYEE'
}

export interface IEmployeeState {
    _id: string;
    name: string;
    position: string;
    qualification: string;
    role: string;
    login: string;
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
    role: '',
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
