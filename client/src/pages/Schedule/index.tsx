import React from 'react';
import Day from './components/Day';
import ScheduleModal from './components/ScheduleModal';
import { pageWrapper } from '../../globalStyles';

const Schedule = () => {
  const [open, setOpen] = React.useState(false);
  const openModal = () => setOpen(true);
  const closeModal = () => setOpen(false);
  return (
    <>
      <div className={pageWrapper}>
        <Day openModal={openModal} />
        <Day openModal={openModal} />
        <Day openModal={openModal} />
        <Day openModal={openModal} />
        <Day openModal={openModal} />
        <Day openModal={openModal} />
        <Day openModal={openModal} />
        <Day openModal={openModal} />
      </div>
      <ScheduleModal
        isOpen={open}
        closeModal={closeModal}
        name={'Рассчитать'}
      />
    </>
  );
};

export default Schedule;
