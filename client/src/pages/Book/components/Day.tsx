import React from 'react';
import DayTable from './DayTable';
import { css } from '@emotion/css';
import { Button, Tag } from 'carbon-components-react';
import { Add16 } from '@carbon/icons-react';
import { getDayName } from '../../../helpers/utils';
import { IBookModalState } from '../index';
import { IAppointment } from '../../../types/appointment-types';
import { DayCode } from '../../../types/date-types';

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
    openModal: (bookModalState: IBookModalState) => void;
    openDayOffModal: (s: string | undefined) => void;
    rows: IAppointment[];
    dayCode: DayCode;
    isOff?: true | null;
    dayOffID: string | undefined;
}

const Day: React.FC<IDayProps> = ({ openModal, openDayOffModal, rows, dayCode, isOff, dayOffID }) => {
    const addNewAppointmentModal = () => {
        openModal({ day: dayCode, isEditingExisting: false });
    };

    const dayOffModalHandler = () => {
        if(rows.length) return
        openDayOffModal(dayOffID);
    };

    return (
        <div className={wrapper}>
            <div className={dayHeader}>
                <Tag type={isOff ? 'cool-gray' : 'teal'} onClick={dayOffModalHandler}>
                    {isOff && 'Выходной '}
                    {getDayName(dayCode)}
                </Tag>
                {!isOff && (
                    <Button
                        onClick={addNewAppointmentModal}
                        renderIcon={Add16}
                        iconDescription="Add"
                        hasIconOnly
                        size="small"
                        kind="tertiary"
                    />
                )}
            </div>
            {rows.length ? <DayTable rowsData={rows} openModal={openModal} /> : <div className={divider} />}
        </div>
    );
};

export default Day;
