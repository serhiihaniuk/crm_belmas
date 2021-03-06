import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';
import d, { dateToTimestamp } from '../../../../helpers/utils';
import { Button, FormLabel, Modal, Select, TextArea, TextInput } from 'carbon-components-react';
import { TimePicker } from '@atlaskit/datetime-picker';
import { mapTimeToTimepicker } from '../../service/tableService';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { useMutation } from '@apollo/client';
import { CREATE_APPOINTMENT, DELETE_APPOINTMENT, UPDATE_APPOINTMENT } from '../../../../gql/mutations/appointment';
import { IApolloClient } from '../../../../index';
import { TrashCan32 } from '@carbon/icons-react';
import ModalInlineLoading from '../../../../components/shared/ModalInlineLoading';
import { bookModalForm, deleteBtn, errorSpan, timePickerCss } from './BookModal.css';
import { IBookModalState } from '../../index';
import { DayCode, HourCode, MonthCode } from '../../../../types/date-types';
import { useProcedures } from '../../service/useProcedures';
import {OccupationType} from "procedure-types";

interface IBookModal {
    isOpen: boolean;
    closeModal: () => void;
    bookModalState: IBookModalState;
    employeeID: string;
    employeeOccupation: OccupationType;
    apolloClient: IApolloClient;
}

interface IAppointmentInput {
    client: string;
    description: string;
    date: string;
    instagram: string;
    procedureCode: string;
    employee: string;
    creator: string;
    monthCode: MonthCode;
    dayCode: DayCode;
    time: HourCode;
}

const BookModal: React.FC<IBookModal> = ({
    isOpen,
    closeModal,
    employeeOccupation,
    bookModalState,
    employeeID,
    apolloClient
}) => {
    const gqlRequestOptions = {
        onCompleted: closeModal
    };
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        reset
    } = useForm<IAppointmentInput>({
        defaultValues: {
            client: '',
            description: '',
            time: '8:00',
            instagram: '',
            procedureCode: 'manicure'
        }
    });

    const { isEditingExisting } = bookModalState;
    const createdBy = useTypedSelector((state) => state.employee._id);
    const [addAppointment, { loading: aaLoading }] = useMutation(CREATE_APPOINTMENT, gqlRequestOptions);
    const [updateAppointment, { loading: uaLoading }] = useMutation(UPDATE_APPOINTMENT, gqlRequestOptions);
    const [deleteAppointment, { loading: daLoading }] = useMutation(DELETE_APPOINTMENT, gqlRequestOptions);
    const [showDeleteBtn, setShowDeleteBtn] = React.useState(false);
    const proceduresSelectItems = useProcedures(employeeOccupation);

    useEffect(() => {
        if (bookModalState.isEditingExisting) {
            const { selectedAppointment } = bookModalState;
            setValue('client', selectedAppointment.client);
            setValue('description', selectedAppointment.description || '');
            setValue('instagram', selectedAppointment.instagram || '');
            setValue('procedureCode', selectedAppointment.procedure.procedureCode);
            setValue('time', selectedAppointment.time);
            return;
        }
    }, [bookModalState, reset, setValue]);

    useEffect(() => {
        if (!isOpen) {
            reset();
            setShowDeleteBtn(false);
        }
    }, [isOpen, reset]);

    const onSubmit: SubmitHandler<IAppointmentInput> = async (appointmentTemplate) => {
        const [year, month, day] = bookModalState.day.split('-');
        const [hour, minute] = appointmentTemplate.time.split(':');

        const appointmentInput: IAppointmentInput = {
            date: String(dateToTimestamp(+year, +month - 1, +day, +hour, +minute)),
            monthCode: d.DayCodeToMonthCode(bookModalState.day),
            dayCode: bookModalState.day,
            employee: employeeID,
            creator: createdBy,
            client: appointmentTemplate.client,
            description: appointmentTemplate.description,
            instagram: appointmentTemplate.instagram,
            procedureCode: appointmentTemplate.procedureCode,
            time: appointmentTemplate.time
        };

        try {
            if (isEditingExisting) {
                await updateAppointment({
                    variables: {
                        appointmentID: bookModalState.selectedAppointment.id,
                        AppointmentInput: appointmentInput
                    }
                });
            } else {
                await addAppointment({
                    variables: {
                        AppointmentInput: appointmentInput
                    }
                });
            }
            await apolloClient.refetchQueries({
                include: ['GET_DAYS_IN_RANGE']
            });
        } catch (e) {
            console.log(e);
        }
    };
    const onDelete = async () => {
        if (!isEditingExisting) return;
        try {
            await deleteAppointment({
                variables: {
                    id: bookModalState.selectedAppointment.id
                }
            });
            apolloClient.refetchQueries({
                include: ['GET_DAYS_IN_RANGE']
            });
        } catch (e) {
            console.log(e);
        }
    };
    const isLoading = aaLoading || uaLoading || daLoading;

    return (
        <Modal
            open={isOpen}
            modalHeading={isEditingExisting ? '???????????????? ????????????' : '???????????????? ????????????'}
            modalLabel=""
            primaryButtonText={isEditingExisting ? '????????????????' : '????????????????'}
            secondaryButtonText="??????????"
            onRequestClose={closeModal}
            onRequestSubmit={handleSubmit(onSubmit)}
        >
            {isLoading ? (
                <ModalInlineLoading />
            ) : (
                <form className={bookModalForm}>
                    <TextInput
                        labelText="?????????????? ??????"
                        id="clientNameBook"
                        warn={!!errors.client}
                        warnText={'?????? ???????? ??????????????????????'}
                        {...register('client', { required: true })}
                    />
                    <Select
                        id="select-1"
                        labelText="???????????????? ??????????????????"
                        {...register('procedureCode', { required: true })}
                        warn={!!errors.procedureCode}
                        warnText={'?????? ???????? ??????????????????????'}
                    >
                        {proceduresSelectItems}
                    </Select>
                    <Controller
                        name="time"
                        control={control as any}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <FormLabel className={timePickerCss}>
                                ???????????????? ??????????
                                <TimePicker
                                    timeFormat="HH:mm"
                                    placeholder={' '}
                                    times={mapTimeToTimepicker()}
                                    appearance={'subtle'}
                                    {...field}
                                />
                                {errors.date && <span className={errorSpan}>?????? ???????? ??????????????????????</span>}
                            </FormLabel>
                        )}
                    />

                    <TextInput labelText="?????????????? ??????????????????" id="name" {...register('instagram')} />
                    <TextArea
                        labelText="??????????????????????"
                        placeholder="..."
                        helperText="???????????????????????????? ????????"
                        {...register('description')}
                    />
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
                            ?????????????? ????????????
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
                            ??????????????
                        </Button>
                    )}
                </div>
            )}
        </Modal>
    );
};

export default BookModal;
