import React, { useEffect, useState } from 'react';
import { DatePicker, DatePickerInput, Modal } from 'carbon-components-react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useDispatch } from 'react-redux';
import { setDate, setDateCurrentMonth, toggleDateModal } from '../../redux/actionCreators/date-actions';
import { getDateFromDateObject, getDateObject } from '../../helpers/utils';
import { IDateState } from '../../redux/reducers/date-reducer';
import { openModalBTN, setCurrentMonthBTN } from './DateModal.css';
import { EventSchedule32 } from '@carbon/icons-react';

const DateModal: React.FC = () => {
    const isOpen = useTypedSelector((state) => state.date.isModalOpen);
    const { from, to } = useTypedSelector((state) => state.date);
    const [dateInput, setDateInput] = useState<IDateState>({ from, to });

    const [datePickerValue, setDatePickerValue] = useState<Date[]>();
    const dispatch = useDispatch();
    const closeModal = () => {
        dispatch(toggleDateModal(false));
    };

    const changeDate = (dateInput: Date[]) => {
        if (dateInput.length !== 2) return;

        setDatePickerValue(dateInput);

        const from = getDateObject(dateInput[0].getTime());
        const to = getDateObject(dateInput[1].getTime());

        setDateInput({ from, to });
    };

    const onSubmit = () => {
        dispatch(setDate(dateInput.from, dateInput.to));
        dispatch(toggleDateModal(false));
    };

    const setCurrentMonthAsSelectedPeriod = () => {
        dispatch(setDateCurrentMonth());
    };

    useEffect(() => {
        const dateValue: Date[] = [getDateFromDateObject(from), getDateFromDateObject(to)];
        setDatePickerValue(dateValue);
    }, [from, to]);
    return (
        <>
            <button
                className={openModalBTN}
                onClick={() => {
                    dispatch(toggleDateModal(true));
                }}
            >
                <EventSchedule32 />
            </button>
            <Modal
                open={isOpen}
                modalHeading={'Дата'}
                modalLabel=""
                primaryButtonText={'Ок'}
                secondaryButtonText="Назад"
                onRequestClose={closeModal}
                onRequestSubmit={onSubmit}
            >
                <DatePicker
                    datePickerType="range"
                    dateFormat="d.m"
                    value={datePickerValue}
                    onChange={changeDate}
                    allowInput={false}
                >
                    <DatePickerInput placeholder="" labelText="От" id="date-modal-picker-start" />
                    <DatePickerInput placeholder="" labelText="До" id="date-modal-picker-end" />
                </DatePicker>

                <button className={setCurrentMonthBTN} onClick={setCurrentMonthAsSelectedPeriod}>
                    Выбрать текущий месяц
                </button>
            </Modal>
        </>
    );
};

export default DateModal;