import React from 'react';
import {
    Button,
    DataTable,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableExpandedRow,
    TableExpandRow
} from 'carbon-components-react';
import { Checkmark32 } from '@carbon/icons-react';
import { headers, IScheduleTableRow } from '../service/tableService';
import { css } from '@emotion/css';

const buttonWrapper = css`
    display: flex;
    justify-content: center;

    button {
        margin: 5px;
        border: 0;
        color: darkslategrey;
        flex: 0 0 100px;
        justify-content: flex-end;
    }
`;
const expandedRow = css`
    td {
        padding: 0 !important;

        p {
            font-size: 12px;
            padding: 10px;
        }
    }
`;

interface IDayTableProps {
    openModal: (day: IScheduleTableRow) => void;
    rowsData: IScheduleTableRow[];
    day: string;
}

const DayTable: React.FC<IDayTableProps> = ({ openModal, rowsData, day }) => {
    return (
        <DataTable size="sm" rows={rowsData} headers={headers}>
            {({ rows, getRowProps, getTableProps, getTableContainerProps }: any) => (
                <TableContainer {...getTableContainerProps()}>
                    <Table {...getTableProps()}>
                        <TableBody>
                            {rows.map((row: any, currentRow: any) => (
                                <React.Fragment key={row.id}>
                                    <TableExpandRow {...getRowProps({ row })} className={rowsData[currentRow].status}>
                                        {row.cells.map((cell: any) => (
                                            <TableCell key={cell.id}>{cell.value}</TableCell>
                                        ))}
                                    </TableExpandRow>
                                    <TableExpandedRow colSpan={headers.length + 1} className={expandedRow}>
                                        <p>{rowsData[currentRow].description}</p>
                                        <div className={buttonWrapper}>
                                            <Button
                                                onClick={() => openModal(rowsData[currentRow])}
                                                renderIcon={Checkmark32}
                                                iconDescription="Add"
                                                size="small"
                                                kind="tertiary"
                                            >
                                                {rowsData[currentRow].status === 'finished' ? 'Изменить' : 'Рассчитать'}
                                            </Button>
                                        </div>
                                    </TableExpandedRow>
                                </React.Fragment>
                            ))}
                        </TableBody>
                    </Table>
                </TableContainer>
            )}
        </DataTable>
    );
};

export default DayTable;
