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
import { headers } from '../../service/summaryService';
import { css } from '@emotion/css';

const wrapper = css`
  margin: 15px 0;
`;

interface ISummaryTableProps {
  name: string;
}

const SummaryTable: React.FC<ISummaryTableProps> = ({ name }) => {
  return (
    <div className={wrapper}>
      <div className="header">
        <Tag>{name}</Tag>
      </div>
      <DataTable size="sm" rows={[]} headers={headers}>
        {({
          rows,
          getRowProps,
          getTableProps,
          getTableContainerProps,
          getHeaderProps
        }: any) => (
          <TableContainer {...getTableContainerProps()}>
            <Table {...getTableProps()}>
              <TableHead>
                <TableRow>
                  {headers.map((header: any) => (
                    <TableHeader {...getHeaderProps({ header })}>
                      {header.header}
                    </TableHeader>
                  ))}
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map((row: any) => (
                  <React.Fragment key={row.id}>
                    <TableRow
                      {...getRowProps({ row })}
                      style={{ background: 'red' }}
                    >
                      {row.cells.map((cell: any) => (
                        <TableCell key={cell.id}>{cell.value}</TableCell>
                      ))}
                    </TableRow>
                  </React.Fragment>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}
      </DataTable>
    </div>
  );
};

export default SummaryTable;
