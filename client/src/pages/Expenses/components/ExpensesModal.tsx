import React from 'react';

import {
    DatePicker,
    DatePickerInput,
    Modal,
    NumberInput,
    Select,
    SelectItem,
    SelectItemGroup,
    TextInput
} from "carbon-components-react";


interface IExpensesModal {
    isOpen: boolean
    closeModal: () => void
    name: string
}

const ExpensesModal: React.FC<IExpensesModal> = ({isOpen, closeModal, name}) => {

    return (
        <Modal
            open={isOpen}
            modalHeading="Добавить"
            modalLabel=""
            primaryButtonText="Добавить"
            secondaryButtonText="Назад"
        onRequestClose={closeModal}>
        <form >
            <DatePicker datePickerType="single"  dateFormat="d/m">
                <DatePickerInput
                    placeholder=""
                    labelText="Дата"
                    id="date-picker-single"

                />
            </DatePicker>
            <TextInput
                labelText="Название"
                id="name"

            />

            <Select id="select-1" defaultValue="placeholder-item" labelText="Категория">
                <SelectItem
                    disabled
                    hidden
                    value="placeholder-item"
                    text=""
                />
                <SelectItemGroup label="Category 1">
                    <SelectItem value="option-1" text="Категория"/>
                    <SelectItem value="option-1" text="Категория"/>
                    <SelectItem value="option-1" text="Категория"/>
                    <SelectItem value="option-1" text="Категория"/>
                    <SelectItem value="option-1" text="Категория"/>
                    <SelectItem value="option-1" text="Категория"/>
                </SelectItemGroup>
            </Select>
            <Select id="select-1" defaultValue="placeholder-item" labelText="Способ оплаты">
                <SelectItem
                    hidden
                    value="placeholder-item"
                    text="Способ оплаты"
                />

                <SelectItemGroup label="Category 1">
                    <SelectItem value="option-1" text="Наличные"/>
                    <SelectItem value="option-2" text="Безналичные"/>
                </SelectItemGroup>
            </Select>
            <NumberInput
                label="Стоимость"
                id="cost"
                value={0}
                min={0}
                max={100}
                light={true}
                hideSteppers={true}
            />
        </form>
        </Modal>
    );
}

export default ExpensesModal
