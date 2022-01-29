import React, { useState } from 'react';

import {
    DatePicker,
    DatePickerInput,
    Modal,
    NumberInput,
    Select,
    SelectItem,
    TextInput
} from 'carbon-components-react';
import { SubmitHandler, useForm } from 'react-hook-form';
import { timestampToDate } from '../../../helpers/utils';
import { useMutation } from '@apollo/client';
import { ADD_NEW_EXPENSE } from '../../../gql/mutations/expenses';

interface IExpensesModal {
    isOpen: boolean;
    closeModal: () => void;
    name: string;
    apolloClient: any;
}

interface IExpenseInput {
    description: string;
    cash: number;
    cashless: number;
    date: string;
    monthCode: string;
    category: string;
    invoice: boolean;
}

interface IExpenseFormTemplate {
    description: string;
    category: string;
    amount: number;
}

const ExpensesModal: React.FC<IExpensesModal> = ({ isOpen, closeModal, apolloClient }) => {
    const [date, setDate] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const {
        register,
        handleSubmit,
        formState: { errors },
        reset
    } = useForm<IExpenseFormTemplate>({
        defaultValues: {
            description: '',
            category: '',
            amount: 0
        }
    });
    const [addNewExpense] = useMutation(ADD_NEW_EXPENSE);
    const onSubmit: SubmitHandler<IExpenseFormTemplate> = async ({ description, category, amount }) => {
        const expense: IExpenseInput = {
            description,
            cash: Number(paymentMethod === 'cash' ? amount : 0),
            cashless: Number(paymentMethod === 'cashless' ? amount : 0),
            date,
            monthCode: date.slice(0, 7),
            category,
            invoice: false
        };
        try {
             await addNewExpense({
                variables: {
                    expenseInput: expense
                }
            });
            await apolloClient.refetchQueries({
                include: ['GET_EXPENSES_BY_MONTH']
            });
            resetForm();
            closeModal();
        } catch (e){
            console.log(e)
        }
    };
    const changeDate = (dateInput: Date[]) => {
        const timestamp = dateInput[0].getTime();
        const dateString = timestampToDate(timestamp, 'YYYY-MM-DD');
        setDate(dateString);
    };
    const resetForm = () => {
        reset();
        setDate('');
        setPaymentMethod('cash');
    };
    return (
        <Modal
            open={isOpen}
            modalHeading="Добавить"
            modalLabel=""
            primaryButtonText="Добавить"
            secondaryButtonText="Назад"
            onRequestClose={closeModal}
            onRequestSubmit={handleSubmit(onSubmit)}
        >
            <form>
                <DatePicker datePickerType="single" dateFormat="d.m" onChange={changeDate} allowInput={false}>
                    <DatePickerInput placeholder="" labelText="Дата" id="date-picker-single" />
                </DatePicker>
                <TextInput labelText="Название" id="name" {...register('description', { required: false })} />

                <Select
                    id="select-1"
                    defaultValue="placeholder-item"
                    labelText="Категория"
                    {...register('category', { required: false })}
                >
                    <SelectItem value="materials" text="Материалы" />
                    <SelectItem value="studio" text="Студия" />
                </Select>
                <Select
                    id="select-1"
                    defaultValue="placeholder-item"
                    labelText="Способ оплаты"
                    onChange={(e) => setPaymentMethod(e.target.value)}
                >
                    <SelectItem value="cash" text="Наличные" />
                    <SelectItem value="cashless" text="Безналичные" />
                </Select>
                <NumberInput
                    label="Стоимость"
                    id="cost"
                    value={0}
                    min={0}
                    max={10000}
                    light={true}
                    hideSteppers={true}
                    {...register('amount', { required: false })}
                />
            </form>
        </Modal>
    );
};

export default ExpensesModal;
