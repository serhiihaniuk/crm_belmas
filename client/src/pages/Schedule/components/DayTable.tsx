import React from 'react';
import {Button} from "carbon-components-react";
import {RequestQuote32, Checkmark32} from '@carbon/icons-react';
import {
    DataTable,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableExpandedRow,
    TableExpandRow
} from "carbon-components-react";
import {headers, IScheduleTableRow, rows} from "../service/tableService";
import {css} from "@emotion/css";

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
`

interface IDayTableProps {
    openModal: (day: string) => void;
    rowsData: IScheduleTableRow[];
    day: string;
}
const DayTable: React.FC<IDayTableProps> = ({openModal, rowsData, day}) => {
    return (
        <DataTable size="sm" rows={rowsData} headers={headers}>
            {({
                  rows,
                  getRowProps,
                  getTableProps,
                  getTableContainerProps,
              }: any) => (
                <TableContainer
                    {...getTableContainerProps()}>
                    <Table {...getTableProps()}>
                        <TableBody>
                            {rows.map((row: any, currentRow: any) => (
                                <React.Fragment key={row.id}>
                                    <TableExpandRow {...getRowProps({row})} style={{background: 'red'}}>
                                        {row.cells.map((cell: any) => (
                                            <TableCell key={cell.id}>{cell.value}</TableCell>
                                        ))}
                                    </TableExpandRow>
                                    <TableExpandedRow
                                        colSpan={headers.length + 1}
                                        className={expandedRow}>
                                        <p >
                                            {rowsData[currentRow].description}
                                        </p>
                                        <div className={buttonWrapper}>
                                            <Button
                                                onClick={openModal as any}
                                                renderIcon={Checkmark32}
                                                iconDescription="Add"
                                                size="small"
                                                kind="tertiary"
                                            >Рассчитать</Button>

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
