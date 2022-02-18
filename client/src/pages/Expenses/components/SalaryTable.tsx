import React from 'react';
import {
    Button,
    DataTable,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow,
    Tag
} from 'carbon-components-react';
import { CreateSalaryPaymentsRows, salaryTableHeaders as headers } from '../service/tableService';
import { css } from '@emotion/css';
import { IPayment } from '../../../gql/query/salary';
import { Add16 } from '@carbon/icons-react';

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
const tableSalaryWrapper = css`
    margin: 25px 0;

    .header {
        display: flex;
        justify-content: space-between;
      div{
        padding: 0 25px;
      }
    }
`;

interface ISalaryTableProps {
    payments: IPayment[];
    employee: string;
}

const SalaryTable: React.FC<ISalaryTableProps> = ({ payments, employee }) => {
    const rowsData = CreateSalaryPaymentsRows(payments);
    return (
        <div className={tableSalaryWrapper}>
            <div className={'header'}>
                <Tag type={'teal'}>{employee}</Tag>
                <Button
                    onClick={() => {}}
                    renderIcon={Add16}
                    iconDescription="Add"
                    hasIconOnly
                    size="small"
                    kind="tertiary"
                />
            </div>
            {
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
                                                    onClick={() => {}}
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
            }
        </div>
    );
};

export default SalaryTable;
