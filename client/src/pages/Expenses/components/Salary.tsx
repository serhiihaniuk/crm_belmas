import React from 'react';
import { useQuery } from '@apollo/client';
import { InlineLoading } from 'carbon-components-react';
import { GET_SALARY_TABLES_BY_MONTH, IGetSalaryTablesQuery } from '../../../gql/query/salary';
import SalaryTable from './SalaryTable';

interface SalaryProps {
    month: string;
}

const Salary: React.FC<SalaryProps> = ({ month }) => {
    const { data, loading } = useQuery<IGetSalaryTablesQuery>(GET_SALARY_TABLES_BY_MONTH, {
        variables: {
            monthCode: month
        }
    });
    if (loading || !data) {
        return <InlineLoading description="Загрузка" />;
    }
    const { getSalaryTablesByMonth: salaryTables } = data;
    return (
        <div>
            {salaryTables.map((table) => {
                return <SalaryTable key={table._id} payments={table.payments} employee={table.employee.name}/>;
            })}
        </div>
    );
};

export default Salary;
