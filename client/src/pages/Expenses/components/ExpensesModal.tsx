import React, { useEffect, useState } from 'react';

import {
    Button,
    DatePicker,
    DatePickerInput,
    Modal,
    NumberInput,
    Select,
    SelectItem,
    TextInput
} from 'carbon-components-react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import { timestampToDate } from '../../../helpers/utils';
import { useMutation } from '@apollo/client';
import { ADD_NEW_EXPENSE, DELETE_EXPENSE, EDIT_EXPENSE } from '../../../gql/mutations/expenses';
import { IExpenseItem } from '../service/tableService';
import { TrashCan32 } from '@carbon/icons-react';
import { css } from '@emotion/css';
import ModalInlineLoading from '../../../components/shared/ModalInlineLoading';

const deleteBtn = css`
    display: flex;
    justify-content: center;
    margin: 2rem 0 1rem;
    width: 100%;
`;

interface IExpensesModal {
    isOpen: boolean;
    closeModal: () => void;
    name: string;
    apolloClient: any;
    selectedExpense: IExpenseItem | undefined;
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

const ExpensesModal: React.FC<IExpensesModal> = ({ isOpen, closeModal, apolloClient, selectedExpense }) => {
    const [isEditingExisting, setIsEdit] = useState<boolean>();
    const [showDeleteBtn, setShowDeleteBtn] = useState<boolean>(false);
    const [datePickerValue, setDatePickerValue] = useState<Date[]>();
    const [date, setDate] = useState('');
    const [paymentMethod, setPaymentMethod] = useState('cash');
    const [addNewExpense, { loading: aneLoading }] = useMutation(ADD_NEW_EXPENSE);
    const [deleteExpense, { loading: deLoading }] = useMutation(DELETE_EXPENSE);
    const [editExpense, { loading: eeLoading }] = useMutation(EDIT_EXPENSE);

    const {
        register,
        handleSubmit,
        formState: { errors },
        setValue,
        reset,
        control
    } = useForm<IExpenseFormTemplate>({
        defaultValues: {
            description: '',
            category: '',
            amount: 0
        }
    });
    useEffect(() => {
        if (!isOpen) {
            setShowDeleteBtn(false);
        }
    }, [isOpen]);
    useEffect(() => {
        if (selectedExpense) {
            setIsEdit(true);
            setValue('description', selectedExpense.description);
            setValue('category', selectedExpense.category);
            setValue('amount', selectedExpense.cash + selectedExpense.cashless);
            changeDate([new Date(+selectedExpense.fullDate)]);
            return;
        }
        resetForm();
        setIsEdit(false);
    }, [selectedExpense]);

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
            if (isEditingExisting) {
                await editExpense({
                    variables: {
                        ExpenseID: selectedExpense?.id,
                        ExpenseInput: expense
                    }
                });
            } else {
                await addNewExpense({
                    variables: {
                        ExpenseInput: expense
                    }
                });
            }

            await apolloClient.refetchQueries({
                include: ['GET_EXPENSES_BY_MONTH']
            });
            resetForm();
            closeModal();
        } catch (e) {
            console.log(e);
        }
    };
    const onDelete = async () => {
        try {
            await deleteExpense({
                variables: {
                    ExpenseID: selectedExpense?.id
                }
            });
            await apolloClient.refetchQueries({
                include: ['GET_EXPENSES_BY_MONTH']
            });
            resetForm();
            closeModal();
        } catch (e) {
            console.log(e);
        }
    };

    const changeDate = (dateInput: Date[]) => {
        setDatePickerValue(dateInput);
        const timestamp = dateInput[0].getTime();
        const dateString = timestampToDate(timestamp, 'YYYY-MM-DD');
        setDate(dateString);
    };
    const resetForm = () => {
        reset();
        setDate('');
        setPaymentMethod('cash');
    };
    const isLoading = aneLoading || deLoading || eeLoading;
    return (
        <Modal
            open={isOpen}
            modalHeading={isEditingExisting ? 'Изменить' : 'Добавить'}
            modalLabel=""
            primaryButtonText={isEditingExisting ? 'Изменить' : 'Добавить'}
            secondaryButtonText="Назад"
            onRequestClose={closeModal}
            onRequestSubmit={handleSubmit(onSubmit)}
        >
            {isLoading ? (
                <ModalInlineLoading />
            ) : (
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
                    <Controller
                        name="amount"
                        control={control as any}
                        rules={{ required: true, min: 1 }}
                        render={({ field }) => (
                            <NumberInput
                                label="Стоимость"
                                id="calculatePrice"
                                light={true}
                                hideSteppers={true}
                                {...field}
                            />
                        )}
                    />
                    {errors.amount && (
                        <span style={{ color: 'red', height: 12, fontSize: 10 }}>Это поле обязательно</span>
                    )}
                </form>
            )}
            {isEditingExisting && !isLoading && (
                <div className={deleteBtn}>
                    {showDeleteBtn ? (
                        <Button
                            onClick={onDelete}
                            renderIcon={TrashCan32}
                            iconDescription="delete"
                            size="small"
                            kind="danger"
                        >
                            Удалить запись
                        </Button>
                    ) : (
                        <Button
                            onClick={() => {
                                setShowDeleteBtn(true);
                            }}
                            renderIcon={TrashCan32}
                            iconDescription="Delete"
                            hasIconOnly
                            size="small"
                            kind="ghost"
                        >
                            Удалить
                        </Button>
                    )}
                </div>
            )}
        </Modal>
    );
};

export default ExpensesModal;
