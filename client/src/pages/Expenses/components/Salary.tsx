import React from 'react';
import { useQuery } from '@apollo/client';
import { InlineLoading } from 'carbon-components-react';
import { GET_SALARY_TABLES_BY_MONTH } from '../../../gql/query/salary';
import SalaryTable from './SalaryTable';
import {MonthCode} from "../../../types/date-types";
import {IGetSalaryTablesQuery} from "../../../types/salary-types";

interface SalaryProps {
    month: MonthCode;
}

const Salary: React.FC<SalaryProps> = ({ month }) => {
    const { data, loading, refetch } = useQuery<IGetSalaryTablesQuery>(GET_SALARY_TABLES_BY_MONTH, {
        variables: {
            monthCode: month
        }
    });
    if (loading) {
        return <InlineLoading description="Загрузка" />;
    }

    if(!data) {
        return <button onClick={refetch}>Обновить</button>;
    }

    const { getSalaryTablesByMonth: salaryTables } = data;
    return (
        <div>
            {salaryTables.map((table) => {
                return (
                    <SalaryTable
                        key={table._id}
                        payments={table.payments}
                        employeeName={table.employee.name}
                        employeeID={table.employee._id}
                    />
                );
            })}
        </div>
    );
};

export default Salary;
