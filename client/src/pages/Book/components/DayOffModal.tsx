import React from 'react';
import { Modal } from 'carbon-components-react';
import { CREATE_DAY_OFF, DELETE_DAY_OFF } from '../../../gql/mutations/day-off';
import { useMutation } from '@apollo/client';
import { ICreateDayOff, IDeleteDayOff } from '../../../types/day-types';
import { IDayOffModalState } from '../index';
import { getDayName } from '../../../helpers/utils';
import ModalInlineLoading from '../../../components/shared/ModalInlineLoading';

interface IDayOffModalProps {
    closeModal: () => void;
    isOpen: boolean;
    dayOffModalState: IDayOffModalState;
    apolloClient: any;
}

const DayOffModal: React.FC<IDayOffModalProps> = ({ closeModal, isOpen, dayOffModalState, apolloClient }) => {
    const [createDayOff, { loading, error }] = useMutation<ICreateDayOff>(CREATE_DAY_OFF, {
        onCompleted: closeModal
    });

    const [deleteDayOff, { loading: doLoading, error: doError }] = useMutation<IDeleteDayOff>(DELETE_DAY_OFF, {
        onCompleted: closeModal
    });

    const onAdd = async () => {
        try {
            const createDayOffVars = {
                dayCode: dayOffModalState.dayCode,
                employeeID: dayOffModalState.employeeID
            };
            await createDayOff({
                variables: createDayOffVars
            });

            apolloClient.refetchQueries({
                include: ['GET_DAYS_IN_RANGE']
            });
        } catch (e) {
            console.log(e);
        }
    };

    const onDelete = async () => {
        try {
            await deleteDayOff({
                variables: {
                    dayOffID: dayOffModalState.dayOffID
                }
            });

            apolloClient.refetchQueries({
                include: ['GET_DAYS_IN_RANGE']
            });
        } catch (e) {
            console.log(e);
        }
    };

    return (
        <Modal
            open={isOpen}
            modalHeading={dayOffModalState.dayOffID ? 'Убрать выходной' : 'Добавить выходной'}
            modalLabel=""
            primaryButtonText={dayOffModalState.dayOffID ? 'Ok' : 'Добавить'}
            secondaryButtonText="Назад"
            onRequestClose={closeModal}
            onRequestSubmit={dayOffModalState.dayOffID ? onDelete : onAdd}
        >
            {loading || doLoading ? <ModalInlineLoading /> : getDayName(dayOffModalState.dayCode)}
        </Modal>
    );
};

export default DayOffModal;