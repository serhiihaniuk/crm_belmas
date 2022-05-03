import React, { useEffect } from 'react';
import { Controller, SubmitHandler, useForm } from 'react-hook-form';

import { Button, FormLabel, Modal, Select, SelectItem, TextArea, TextInput } from 'carbon-components-react';
import { TimePicker } from '@atlaskit/datetime-picker';
import { mapTimeToTimepicker } from '../../service/tableService';
import { useTypedSelector } from '../../../../hooks/useTypedSelector';
import { useMutation } from '@apollo/client';
import { CREATE_APPOINTMENT, DELETE_APPOINTMENT, UPDATE_APPOINTMENT } from '../../../../gql/mutations/appointment';
import { IApolloClient } from '../../../../index';
import { TrashCan32 } from '@carbon/icons-react';
import { dateToTimestamp } from '../../../../helpers/utils';
import ModalInlineLoading from '../../../../components/shared/ModalInlineLoading';
import { bookModalForm, deleteBtn, errorSpan, timePickerCss } from './BookModal.css';

interface IBookModal {
    isOpen: boolean;
    closeModal: () => void;
    selectedDay: {
        day: string;
        selectedAppointment: any;
        isEditingExisting: boolean;
    };
    employee: string;
    apolloClient: IApolloClient;
}

interface IAppointmentTemplate {
    client: string;
    description: string;
    date: string;
    instagram: string;
    procedure: string;
    employee: string;
    creator: string;
    monthCode: string;
}

const BookModal: React.FC<IBookModal> = ({ isOpen, closeModal, selectedDay, employee, apolloClient }) => {
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        setValue,
        reset
    } = useForm<IAppointmentTemplate>({
        defaultValues: {
            client: '',
            description: '',
            date: '',
            instagram: '',
            procedure: 'manicure'
        }
    });
    const { selectedAppointment, isEditingExisting } = selectedDay;
    const createdBy = useTypedSelector((state) => state.employee._id);
    const [addAppointment, { loading: aaLoading }] = useMutation(CREATE_APPOINTMENT, {
        onCompleted: closeModal
    });
    const [updateAppointment, { loading: uaLoading }] = useMutation(UPDATE_APPOINTMENT, {
        onCompleted: closeModal
    });
    const [deleteAppointment, { loading: daLoading }] = useMutation(DELETE_APPOINTMENT, {
        onCompleted: closeModal
    });
    const [showDeleteBtn, setShowDeleteBtn] = React.useState(false);
    useEffect(() => {
        if (selectedAppointment) {
            setValue('client', selectedAppointment.client);
            setValue('description', selectedAppointment.description);
            setValue('instagram', selectedAppointment.instagram);
            setValue('procedure', selectedAppointment.procedure);
            setValue('date', selectedAppointment.date);
            return;
        }
    }, [selectedAppointment, reset, setValue]);
    useEffect(() => {
        if (!isOpen) {
            reset();
            setShowDeleteBtn(false);
        }
    }, [isOpen]);
    const onSubmit: SubmitHandler<IAppointmentTemplate> = async (appointmentTemplate) => {
        if (isEditingExisting) {
            const dateFromTS = new Date(+selectedAppointment.timestamp);
            selectedDay.day = `${dateFromTS.getFullYear()}-${dateFromTS.getMonth() + 1}-${dateFromTS.getDate()}`;
        }

        const [year, month, day] = selectedDay.day.split('-');
        const [hour, minute] = appointmentTemplate.date.split(':');
        appointmentTemplate.date = String(dateToTimestamp(+year, +month - 1, +day, +hour, +minute));
        appointmentTemplate.monthCode = `${year}-${month}`;
        appointmentTemplate.employee = employee;
        appointmentTemplate.creator = createdBy;

        try {
            if (isEditingExisting) {
                await updateAppointment({
                    variables: {
                        appointmentID: selectedAppointment.id,
                        AppointmentInput: appointmentTemplate
                    }
                });
            } else {
                await addAppointment({
                    variables: {
                        AppointmentInput: appointmentTemplate
                    }
                });
            }
            await apolloClient.refetchQueries({
                include: ['GET_APPOINTMENTS_BY_DAYS']
            });
        } catch (e) {
            console.log(e);
        }
    };
    const onDelete = async () => {
        try {
            await deleteAppointment({
                variables: {
                    id: selectedAppointment.id
                }
            });
            apolloClient.refetchQueries({
                include: ['GET_APPOINTMENTS_BY_DAYS']
            });
        } catch (e) {
            console.log(e);
        }
    };
    const isLoading = aaLoading || uaLoading || daLoading;

    return (
        <Modal
            open={isOpen}
            modalHeading={isEditingExisting ? 'Изменить запись' : 'Добавить запись'}
            modalLabel=""
            primaryButtonText={isEditingExisting ? 'Изменить' : 'Добавить'}
            secondaryButtonText="Назад"
            onRequestClose={closeModal}
            onRequestSubmit={handleSubmit(onSubmit)}
        >
            {isLoading ? (
                <ModalInlineLoading />
            ) : (
                <form className={bookModalForm}>
                    <TextInput
                        labelText="Введите имя"
                        id="clientNameBook"
                        warn={!!errors.client}
                        warnText={'Это поле обязательно'}
                        {...register('client', { required: true })}
                    />
                    <Select
                        id="select-1"
                        labelText="Выберите процедуру"
                        {...register('procedure', { required: true })}
                        warn={!!errors.procedure}
                        warnText={'Это поле обязательно'}
                    >
                        <SelectItem value="manicure" text="Маникюр" />
                        <SelectItem value="pedicure" text="Педикюр" />
                    </Select>
                    <Controller
                        name="date"
                        control={control as any}
                        rules={{ required: true }}
                        render={({ field }) => (
                            <FormLabel className={timePickerCss}>
                                Выберите время
                                <TimePicker
                                    timeFormat="HH:mm"
                                    placeholder={' '}
                                    times={mapTimeToTimepicker()}
                                    appearance={'subtle'}
                                    {...field}
                                />
                                {errors.date && <span className={errorSpan}>Это поле обязательно</span>}
                            </FormLabel>
                        )}
                    />

                    <TextInput labelText="профиль инстаграм" id="name" {...register('instagram')} />
                    <TextArea
                        labelText="Комментарий"
                        placeholder="..."
                        helperText="необязательное поле"
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

export default BookModal;
