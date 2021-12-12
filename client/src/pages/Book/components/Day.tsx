import React from 'react';
import DayTable from './DayTable';
import { css } from '@emotion/css';
import { Button, Tag } from 'carbon-components-react';
import { Add16 } from '@carbon/icons-react';
import { BookTableRow, getDayName } from '../service/tableService';

const wrapper = css`
  padding: 10px 0;
  
`;
const dayHeader = css`
  display: flex;
  justify-content: space-between;
`;

const divider = css`
  width: 90%;
  height: 1px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin: 15px auto 25px;
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);
`;
interface IDayProps {
  openModal: (day: string) => void;
  rows: BookTableRow[];
  day: string;
}

const Day: React.FC<IDayProps> = ({ openModal, rows, day }) => {

  return (
    <div className={wrapper}>
      <div className={dayHeader}>
        <Tag type={'teal'}>
          {getDayName(day)}
        </Tag>
        <Button
          onClick={() => {
            openModal(day);
          }}
          renderIcon={Add16}
          iconDescription='Add'
          hasIconOnly
          size='small'
          kind='tertiary'
        /></div>
      {rows.length ? <DayTable rowsData={rows} openModal={openModal} /> : <div className={divider}/>}
    </div>

  );
};

export default Day;
