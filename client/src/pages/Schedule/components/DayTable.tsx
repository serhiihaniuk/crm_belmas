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
import {headers, rows} from "../service/tableService";
import {css} from "@emotion/css";

const buttonWrapper = css`
  display: flex;
  button {
    margin: 5px;
    border: 0;
    color: darkslategrey;
  }
`
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
    openModal: () => void;
}
const DayTable: React.FC<IDayTableProps> = ({openModal}) => {
    return (
        <DataTable size="sm" rows={rows} headers={headers}>
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
                            {rows.map((row: any) => (
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
                                            Комментарий:
                                            В отличии от lorem ipsum, текст рыба на русском языке наполнит любой
                                            макет непонятным смыслом и придаст неповторимый колорит советских времен.
                                        </p>
                                        <div className={buttonWrapper}>
                                            <Button
                                                onClick={openModal}
                                                renderIcon={RequestQuote32}
                                                iconDescription="Add"
                                                size="small"
                                                kind="tertiary"
                                            >Редактировать</Button>
                                            <Button
                                                onClick={openModal}
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
