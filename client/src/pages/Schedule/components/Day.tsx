import React from 'react';
import DayTable from "./DayTable";
import {css} from '@emotion/css';
import { Tag} from "carbon-components-react";

const wrapper = css`
  padding: 10px 0;
`
const dayHeader = css`
  display: flex;
  justify-content: space-between;
`

interface IDayProps {
    openModal: () => void
}
const Day: React.FC<IDayProps> = ({openModal}) => {

    return (
        <div className={wrapper}>
            <div className={dayHeader}>
                <Tag type={'teal'}>
                    25.06 вт
                </Tag>
                </div>
            <DayTable openModal={openModal}/>
        </div>

    );
};

export default Day;
