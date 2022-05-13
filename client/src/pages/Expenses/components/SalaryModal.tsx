import React, { FC, useState } from 'react';
import { DatePicker, DatePickerInput, Modal, NumberInput, Select, SelectItem } from 'carbon-components-react';
import ModalInlineLoading from '../../../components/shared/ModalInlineLoading';
import { dateToTimestamp, timestampToDate } from '../../../helpers/utils';
import { useMutation } from '@apollo/client';
import { ADD_NEW_SALARY_PAYMENT, DELETE_SALARY_PAYMENT } from '../../../gql/mutations/salary';
import { DayCode } from '../../../types/date-types';
import { IAddSalaryPayment, ISalaryPaymentInput } from '../../../types/salary-types';
import d from "../../../helpers/utils";
import {PrepareSalaryTableCode} from "../service/tableService";

interface ISalaryModalProps {
    isOpen: boolean;
    selectedPaymentID: string | null;
    closeModal: () => void;
    employeeID: string;
    apolloClient: any;
}

const SalaryModal: FC<ISalaryModalProps> = ({ isOpen, selectedPaymentID, closeModal, employeeID, apolloClient }) => {
    const [datePickerValue, setDatePickerValue] = useState<Date[]>();
    const [date, setDate] = useState<DayCode | ''>('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [amount, setAmount] = useState(0);
    const [addPayment, { loading }] = useMutation<IAddSalaryPayment>(ADD_NEW_SALARY_PAYMENT, {
        onCompleted: () => {
            closeModal();
        },
        onError: (error) => {
            console.log(error);
        }
    });
    const [deletePayment] = useMutation(DELETE_SALARY_PAYMENT, {
        onCompleted: () => {
            closeModal();
        },
        onError: (error) => {
            console.log(error);
        }
    });
    const onSubmit = async () => {
        if(!date) return;
        const monthCode = d.DayCodeToMonthCode(date);
        const payedCash = paymentMethod === 'cash' ? +amount : 0;
        const payedCashless = paymentMethod === 'cashless' ? +amount : 0;
        const [year, month, day] = date.split('-');
        const SalaryPaymentInput: ISalaryPaymentInput = {
            date: String(dateToTimestamp(+year, +month, +day)),
            monthCode: monthCode,
            dayCode: date,
            salaryTableCode: PrepareSalaryTableCode(monthCode, employeeID),
            payedCash: payedCash,
            payedCashless: payedCashless
        };
        await addPayment({ variables: { SalaryPaymentInput } });
        await apolloClient.refetchQueries({
            include: ['GET_SALARY_TABLES_BY_MONTH']
        });
    };
    const changeDate = (dateInput: Date[]) => {
        setDatePickerValue(dateInput);
        const timestamp = dateInput[0].getTime();
        const dateString = timestampToDate(timestamp, 'DayCode') as DayCode;
        setDate(dateString);
    };
    const onDelete = async () => {
        await deletePayment({
            variables: {
                SalaryPaymentID: selectedPaymentID
            }
        });
        apolloClient.refetchQueries({
            include: ['GET_SALARY_TABLES_BY_MONTH']
        });
    };
    return (
        <Modal
            open={isOpen}
            modalHeading={selectedPaymentID ? 'Удалить?' : 'Добавить'}
            modalLabel=""
            primaryButtonText={selectedPaymentID ? 'Удалить' : 'Добавить'}
            secondaryButtonText="Назад"
            onRequestClose={closeModal}
            onRequestSubmit={selectedPaymentID ? onDelete : onSubmit}
        >
            {loading ? (
                <ModalInlineLoading />
            ) : (
                !selectedPaymentID && (
                    <form>
                        <DatePicker
                            datePickerType="single"
                            dateFormat="d.m"
                            value={datePickerValue}
                            onChange={changeDate}
                            allowInput={false}
                        >
                            <DatePickerInput placeholder="" labelText="Дата" id="date-picker-single" />
                        </DatePicker>
                        <Select
                            id="select-1"
                            defaultValue="placeholder-item"
                            labelText="Способ оплаты"
                            onChange={(e: any) => setPaymentMethod(e.target.value)}
                        >
                            <SelectItem value="cash" text="Наличные" />
                            <SelectItem value="cashless" text="Безналичные" />
                        </Select>

                        <NumberInput
                            label="Стоимость"
                            id="calculatePrice"
                            light={true}
                            hideSteppers={true}
                            value={amount}
                            onChange={(e: any) => setAmount(e.target.value)}
                        />
                    </form>
                )
            )}
        </Modal>
    );
};

export default SalaryModal;
