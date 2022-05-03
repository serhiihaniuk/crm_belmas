import React from 'react';
import {
    DataTable,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableHeader,
    TableRow
} from 'carbon-components-react';
import { IRevenueTableRow, revenueTableHeaders as headers } from '../../service/summaryService';
import { css } from '@emotion/css';

const table = css`
    td,
    th {
        text-align: center;
    }
    .cash {
        background-color: #d3e4cd;
    }
    .cashless {
        background-color: #e2c2b9;
    }
    .rowrow {
        .row {
            padding-right: 1rem;
            padding-left: 1rem;
            border-top: 1px solid #9e7777 !important;
            border-bottom: 1px solid #9e7777 !important;
            color: #525252;
        }
    }
`;

interface IRevenueTableProps {
    rowData: IRevenueTableRow[];
}

const RevenueTable: React.FC<IRevenueTableProps> = ({ rowData }) => {
    return (
        <>
            <DataTable size="sm" rows={rowData} headers={headers}>
                {({ rows, getRowProps, getTableProps, getTableContainerProps, getHeaderProps }: any) => (
                    <TableContainer {...getTableContainerProps()}>
                        <Table {...getTableProps()} className={table}>
                            <TableHead>
                                <TableRow>
                                    {headers.map((header: any) => (
                                        <TableHeader {...getHeaderProps({ header })}>{header.header}</TableHeader>
                                    ))}
                                </TableRow>
                            </TableHead>
                            <TableBody className={table}>
                                {rows.map((row: any) => (
                                    <React.Fragment key={row.id}>
                                        <TableRow {...getRowProps({ row })} className={'rowrow'}>
                                            {row.cells.map((cell: any) => (
                                                <TableCell className={`${cell.info.header} row`} key={cell.id}>
                                                    {cell.value}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    </React.Fragment>
                                ))}
                            </TableBody>
                        </Table>
                    </TableContainer>
                )}
            </DataTable>
        </>
    );
};

export default RevenueTable;
