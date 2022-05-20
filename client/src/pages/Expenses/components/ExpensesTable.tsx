import React from 'react';
import {
    DataTable,
    InlineLoading,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
    Tag
} from 'carbon-components-react';
import { CreateExpensesRows, headers } from '../service/tableService';
import { css } from '@emotion/css';
import { useQuery } from '@apollo/client';
import { GET_EXPENSES_BY_MONTH } from '../../../gql/query/expenses';
import { IExpense, IGetExpensesByMonth } from '../../../types/expenses-types';
import { MonthCode } from '../../../types/date-types';

const tagStyle = css`
    margin: 10px 10px 5px 0;
`;
const table = css`
    td,
    th {
        text-align: center;
        padding: 3px;
    }

    .name {
        text-align: left;
    }
`;
const loadingCSS = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 300px;
`;

interface Props {
    monthCode: MonthCode;
    setSelectedExpense: (value: IExpense) => void;
    openModal: () => void;
}

const ExpensesTable: React.FC<Props> = ({ monthCode, setSelectedExpense, openModal }) => {
    const { data, loading } = useQuery<IGetExpensesByMonth>(GET_EXPENSES_BY_MONTH, {
        variables: {
            monthCode: monthCode
        }
    });

    if (loading) {
        return <InlineLoading className={loadingCSS} description="Загрузка" />;
    }
    if (!data) {
        return <div>Error while loading expenses table data</div>;
    }
    const rowsData = CreateExpensesRows(data.getExpensesByMonth);
    return (
        <>

            {!!rowsData.length && (
                <DataTable size="sm" rows={rowsData as any} headers={headers as any}>
                    {({ rows, getRowProps, getTableProps, getTableContainerProps, getHeaderProps }: any) => (
                        <TableContainer {...getTableContainerProps()}>
                            <Table {...getTableProps()} className={table}>
                                <TableHead>
                                    <TableRow>
                                        {headers.map((header) => (
                                            <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                                        ))}
                                    </TableRow>
                                </TableHead>
                                <TableBody className={table}>
                                    {rows.map((row: any, currentRow: number) => {
                                        return (
                                            <React.Fragment key={row.id}>
                                                <TableRow
                                                    {...getRowProps({ row })}
                                                    style={{ cursor: 'pointer' }}
                                                    onClick={() => {
                                                        setSelectedExpense(rowsData[currentRow]);
                                                        openModal();
                                                    }}
                                                >
                                                    {row.cells.map((cell: any) => {
                                                        return (
                                                            <TableCell className={cell.info.header} key={cell.id}>
                                                                {cell.value}
                                                            </TableCell>
                                                        );
                                                    })}
                                                </TableRow>
                                            </React.Fragment>
                                        );
                                    })}
                                </TableBody>
                            </Table>
                        </TableContainer>
                    )}
                </DataTable>
            )}
        </>
    );
};

export default ExpensesTable;
