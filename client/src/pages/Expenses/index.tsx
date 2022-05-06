import { css } from '@emotion/css';
import { Button, Tab, Tabs, Tag } from 'carbon-components-react';
import { Add16 } from '@carbon/icons-react';
import React, { useState } from 'react';
import ExpensesModal from './components/ExpensesModal';
import ExpensesTable from './components/ExpensesTable';
import { pageWrapper } from '../../globalStyles';
import { ApolloConsumer } from '@apollo/client';
import { IExpenseItem } from './service/tableService';
import Salary from './components/Salary';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { getMonthName } from '../../helpers/utils';

const addButton = css`
    margin: 10px 0 0 71%;
`;

const monthTag = css`
    min-width: 85px;
    max-height: 15px;
    box-shadow: none;
    align-self: center;
    margin-left: 20px;
`;

const Expenses: React.FC = () => {
    const [isOpenModal, setIsOpenModal] = useState(false);
    const [selectedExpense, setSelectedExpense] = useState<IExpenseItem | undefined>();
    const { from } = useTypedSelector((state) => state.date);

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
                <Tab id="id-3-13" label="Материалы">
                    <ExpensesTable
                        monthCode={`${from.YYYY}-${from.MM}`}
                        setSelectedExpense={setSelectedExpense}
                        openModal={openModal}
                    />
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
                    <Salary month={`${from.YYYY}-${from.MM}`} />
                </Tab>
                <Tag type={'teal'} className={monthTag}>
                    {getMonthName(from.MM)}
                </Tag>
            </Tabs>
            <ApolloConsumer>
                {(client) => (
                    <ExpensesModal
                        isOpen={isOpenModal}
                        closeModal={closeModal}
                        name={'Расходы'}
                        apolloClient={client as any}
                        selectedExpense={selectedExpense}
                    />
                )}
            </ApolloConsumer>
        </div>
    );
};

export default Expenses;
