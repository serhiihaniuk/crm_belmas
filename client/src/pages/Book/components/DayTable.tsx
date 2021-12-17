import React from 'react';
import {Button, Link} from 'carbon-components-react';
import {RequestQuote32} from '@carbon/icons-react';
import {
    DataTable,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableExpandedRow,
    TableExpandRow
} from 'carbon-components-react';
import {headers} from '../service/tableService';
import {css} from '@emotion/css';
import {BookTableRow} from '../service/tableService';

const booktable = css`
  .client {
    max-width: 100px;
    overflow: hidden;
    text-overflow: ellipsis;
  }
`;
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
    rowsData: BookTableRow[];
    openModal: (day: string, appointmentID: BookTableRow | undefined, isEditing: boolean) => void;
}

const DayTable: React.FC<IDayTableProps> = ({rowsData, openModal}) => {


    return (<DataTable size='sm' rows={rowsData} headers={headers}>
        {({
              rows,
              getRowProps,
              getTableProps,
              getTableContainerProps
          }: any) => (
            <TableContainer className={booktable}
                            {...getTableContainerProps()}>
                <Table {...getTableProps()}>
                    <TableBody>
                        {rows.map((row: any, currentRow: any) => {
                            if(!rowsData[currentRow]) return null
                            const instagramLink = rowsData[currentRow].instagram;
                            return (
                                <React.Fragment key={row.id}>
                                    <TableExpandRow {...getRowProps({row})} className={
                                        rowsData[currentRow].status
                                    }>
                                        {row.cells.map((cell: any) => {
                                            return (
                                                <TableCell key={cell.id}
                                                           className={cell.info.header}>{cell.value}</TableCell>
                                            );
                                        })}
                                    </TableExpandRow>
                                    <TableExpandedRow
                                        colSpan={headers.length + 1}
                                        className={expandedRow}>

                                        <p>

                                            {rowsData[currentRow].description}
                                        </p>
                                        {instagramLink && (
                                            <p>
                                                <Link href={instagramLink}>Instagram</Link>
                                            </p>)}
                                        <div className={buttonWrapper}>
                                            <Button
                                                onClick={() => {
                                                    openModal("edit", rowsData[currentRow], true)
                                                }}
                                                renderIcon={RequestQuote32}
                                                iconDescription='Add'
                                                size='small'
                                                kind='tertiary'
                                            >Редактировать</Button>
                                        </div>
                                    </TableExpandedRow>
                                </React.Fragment>
                            );
                        })}
                    </TableBody>
                </Table>
            </TableContainer>
        )}
    </DataTable>);
};

export default DayTable;


