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
import {
  revenueTableHeaders as headers,
  revenueTableRows as rows
} from '../../service/summaryService.ts.js';
import { css } from '@emotion/css';

const table = css`
  td,
  th {
    text-align: center;
  }
  .cash {
    background-color: #D3E4CD;
  }
  .cashless {
    background-color: #E2C2B9;
  }
  .rowrow{
    .row{
      padding-right: 1rem;
      padding-left: 1rem;
      border-top: 1px solid #9E7777 !important;
      border-bottom: 1px solid #9E7777 !important;
      color: #525252;
    }
  }
  
`;

const RevenueTable: React.FC = () => {
  return (
    <>
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
                    <TableRow {...getRowProps({ row })} className={"rowrow"}>
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
