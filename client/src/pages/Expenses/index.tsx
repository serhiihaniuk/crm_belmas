import { css } from '@emotion/css';
import { Button, Tab, Tabs } from 'carbon-components-react';
import { Add16 } from '@carbon/icons-react';
import React, { useState } from 'react';
import ExpensesModal from './components/ExpensesModal';
import ExpensesTable from './components/ExpensesTable';
import { pageWrapper } from '../../globalStyles';

const addButton = css`
  margin: 10px 0 0 71%;
`;
const Expenses: React.FC = () => {
  const [isOpenModal, setIsOpenModal] = useState(false);
  const [name, setName] = useState('');
  const [month, setMonth] = useState('2021-12');

  const openModal = () => {
    setIsOpenModal(true);
  };
  const closeModal = () => {
    setIsOpenModal(false);
  };
  return (
    <div className={pageWrapper}>
      <Tabs>
        <Tab id="tab-1" label="Материалы">
          <ExpensesTable monthCode={month}/>
        </Tab>
        <Tab id="tab-3" label="Зарплата">
          <ExpensesTable monthCode={month}/>
        </Tab>
      </Tabs>
      <ExpensesModal isOpen={isOpenModal} closeModal={closeModal} name={name} />
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
    </div>
  );
};

export default Expenses;
