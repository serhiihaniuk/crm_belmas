import React from 'react';
import DayTable from "./DayTable";
import {css} from '@emotion/css';
import { Tag} from "carbon-components-react";
import {IScheduleTableRow} from "../service/tableService";
import {getDayName} from "../../../helpers/utils";

const wrapper = css`
  padding: 10px 0;
`
const dayHeader = css`
  display: flex;
  justify-content: space-between;
`
const divider = css`
  width: 90%;
  height: 1px;
  border-bottom: 1px solid rgba(0, 0, 0, 0.1);
  margin: 15px auto 25px;
  box-shadow: 0 4px 5px rgba(0, 0, 0, 0.1);
`;

interface IDayProps {
    openModal: (day: string) => void;
    rows: IScheduleTableRow[];
    day: string;
}
const Day: React.FC<IDayProps> = ({openModal, rows, day}) => {

    return (
        <div className={wrapper}>
            <div className={dayHeader}>
                <Tag type={'teal'}>
                    {getDayName(day)}
                </Tag>
                </div>
            {rows.length ? <DayTable rowsData={rows} openModal={openModal} day={day} /> : <div className={divider}/>}
        </div>

    );
};

export default Day;

