import React from 'react';
import { Modal } from 'carbon-components-react';
import { useTypedSelector } from '../../hooks/useTypedSelector';
import { useDispatch } from 'react-redux';
import { toggleDateModal } from '../../redux/actionCreators/date-actions';

const DateModal: React.FC<any> = () => {
    const isOpen = useTypedSelector((state) => state.date.isModalOpen);
    const dispatch = useDispatch();
    const closeModal = () => {
        dispatch(toggleDateModal(false));
    };
    return (
        <Modal
            open={isOpen}
            modalHeading={'Дата'}
            modalLabel=""
            primaryButtonText={'Ок'}
            secondaryButtonText="Назад"
            onRequestClose={closeModal}
            onRequestSubmit={() => {}}
        >
            ы
        </Modal>
    );
};

export default DateModal;