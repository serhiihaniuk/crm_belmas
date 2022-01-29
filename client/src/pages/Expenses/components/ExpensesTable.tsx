import React, { useEffect } from 'react';
import {
  DataTable, InlineLoading,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableHeader,
  TableRow,
  Tag
} from 'carbon-components-react';
import {CreateExpensesRows, headers} from '../service/tableService';
import { css } from '@emotion/css';
import { useQuery } from '@apollo/client';
import { GET_EXPENSES_BY_MONTH } from '../../../gql/query/expenses';

const tagStyle = css`
  margin: 10px 0 5px;
`;
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
const loadingCSS = css`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 300px;`
interface Props {
  monthCode: string;
}

const ExpensesTable: React.FC<Props> = ({ monthCode }) => {
  const { data, loading } = useQuery(GET_EXPENSES_BY_MONTH, {
    variables: {
      monthCode: monthCode
    }
  });
  if (loading || !data) {
    return <InlineLoading className={loadingCSS} description='Загрузка'/>
  }

  return (
    <>
      <Tag type={'teal'} className={tagStyle}>
        Всего: 2222 zł.
      </Tag>

      {
        <DataTable size="sm" rows={CreateExpensesRows(data.getExpensesByMonth) as any} headers={headers as any}>
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
      }
    </>
  );
};

export default ExpensesTable;
