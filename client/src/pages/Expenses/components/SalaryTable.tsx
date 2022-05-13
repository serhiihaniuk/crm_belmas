import React, { useState } from 'react';
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
import { Add16 } from '@carbon/icons-react';
import SalaryModal from './SalaryModal';
import { ApolloConsumer } from '@apollo/client';
import {ISalaryPaymentRaw} from "../../../types/salary-types";

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

        div {
            padding: 0 25px;
        }
    }
`;

interface ISalaryTableProps {
    payments: ISalaryPaymentRaw[];
    employeeName: string;
    employeeID: string;
}



const SalaryTable: React.FC<ISalaryTableProps> = ({ payments, employeeName, employeeID }) => {
    const rowsData = CreateSalaryPaymentsRows(payments);
    const [isOpen, setIsOpen] = React.useState(false);
    const [selectedPaymentID, setSelectedPaymentID] = useState<null | string>(null);
    const openModal = (paymentID: string | null = null) => {
        setSelectedPaymentID(paymentID);
        setIsOpen(true);
    };
    const closeModal = () => setIsOpen(false);
    return (
        <div className={tableSalaryWrapper}>
            <ApolloConsumer>
                {(client) => (
                    <SalaryModal
                        apolloClient={client}
                        isOpen={isOpen}
                        closeModal={closeModal}
                        selectedPaymentID={selectedPaymentID}
                        employeeID={employeeID}
                    />
                )}
            </ApolloConsumer>
            <div className={'header'}>
                <Tag type={'teal'}>{employeeName}</Tag>
                <Button
                    onClick={() => {
                        openModal();
                    }}
                    renderIcon={Add16}
                    iconDescription="Add"
                    hasIconOnly
                    size="small"
                    kind="tertiary"
                />
            </div>
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
                                                        openModal(rowsData[currentRow].id);
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
        </div>
    );
};

export default SalaryTable;
