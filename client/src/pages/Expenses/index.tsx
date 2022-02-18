import { css } from '@emotion/css';
import { Button, Tab, Tabs } from 'carbon-components-react';
import { Add16 } from '@carbon/icons-react';
import React, { useState } from 'react';
import ExpensesModal from './components/ExpensesModal';
import ExpensesTable from './components/ExpensesTable';
import { pageWrapper } from '../../globalStyles';
import { ApolloConsumer } from '@apollo/client';
import { IExpenseItem } from './service/tableService';
import Salary from "./components/Salary";

const addButton = css`
    margin: 10px 0 0 71%;
`;
const Expenses: React.FC = () => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<IExpenseItem | undefined>();
    const [name, setName] = useState('');
    const [month, setMonth] = useState('2021-12');

    const openModal = () => {
        setIsOpenModal(true);
    };
    const closeModal = () => {
        setSelectedExpense(undefined);
        setIsOpenModal(false);
    };
    return (
        <div className={pageWrapper}>
            <Tabs>
                <Tab id="tab-1" label="Материалы">
                    <ExpensesTable monthCode={month} setSelectedExpense={setSelectedExpense} openModal={openModal} />
                    <Button
                        className={addButton}
                        onClick={openModal}
                        renderIcon={Add16}
                        iconDescription="Add"
                        hasIconOnly
                        size="small"
                        kind="tertiary"
                    >
                        Добавить
                    </Button>
                </Tab>
                <Tab id="tab-3" label="Зарплата">
                    <Salary month={month}/>
                </Tab>
            </Tabs>
            <ApolloConsumer>
                {(client) => (
                    <ExpensesModal
                        isOpen={isOpenModal}
                        closeModal={closeModal}
                        name={name}
                        apolloClient={client as any}
                        selectedExpense={selectedExpense}
                    />
                )}
            </ApolloConsumer>
        </div>
    );
};

export default Expenses;
