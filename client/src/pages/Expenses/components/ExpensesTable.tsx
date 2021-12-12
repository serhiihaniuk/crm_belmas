import React from 'react';
import {
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
import { headers, rows } from '../service/tableService';
import { css } from '@emotion/css';

const tagStyle = css`
 margin: 10px 0 5px;
`;
const table = css`
  td,
  th {
    text-align: center;
  }

  .name {
    text-align: left;
  }
`;

const ExpensesTable: React.FC = () => {
  return (
    <>
      <Tag type={'teal'} className={tagStyle}>Всего: 2222 zł.</Tag>
      <DataTable size="sm" rows={rows} headers={headers}>
        {({
          rows,
          getRowProps,
          getTableProps,
          getTableContainerProps,
          getHeaderProps
        }: any) => (
          <TableContainer {...getTableContainerProps()}>
            <Table {...getTableProps()} className={table}>
              <TableHead>
                <TableRow>
                  {headers.map((header) => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody className={table}>
                {rows.map((row: any) => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      {...getRowProps({ row })}
                      style={{ background: 'red' }}
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </>
  );
};

export default ExpensesTable;
