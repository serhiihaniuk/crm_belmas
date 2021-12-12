import { EmployeeActionTypes, IEmployeeState, ISetEmployeeAction } from '../reducers/employee-reducer';

export const setEmployeeAction = (employee: IEmployeeState): ISetEmployeeAction => {
  return {
    type: EmployeeActionTypes.SET_EMPLOYEE,
    payload: { ...employee, isAuth: true }
  };
};
