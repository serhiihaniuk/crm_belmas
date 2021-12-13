import React, {useEffect} from 'react';
import {SubmitHandler, useForm, Controller} from "react-hook-form";

import {
    Button,
    FormLabel,
    Modal,
    Select,
    SelectItem,
    TextArea,
    TextInput
} from 'carbon-components-react';
import {TimePicker} from '@atlaskit/datetime-picker';
import { mapTimeToTimepicker} from '../service/tableService';
import {css} from '@emotion/css';
import {useTypedSelector} from '../../../hooks/useTypedSelector';
import {useMutation} from '@apollo/client';
import {CREATE_APPOINTMENT, DELETE_APPOINTMENT, UPDATE_APPOINTMENT} from '../../../gql/mutations/appointment';
import {IApolloClient} from '../../../index';
import {TrashCan32} from "@carbon/icons-react";
import {dateToTimestamp} from "../../../helpers/utils";


const timePickerCss = css`
  width: 100%;

  & > div {
    margin-top: 2px;
    background-color: #fff;
    border-bottom: 1px solid #8d8d8d;
  }
`;
const deleteBtn = css`
  display: flex;
  justify-content: center;
  margin: 2rem 0 1rem;
  width: 100%;
`
const errorSpan = css`
  color: #ff6662;
  height: 7px;
  font-size: 12px;
`;

interface IBookModal {
    isOpen: boolean;
    closeModal: () => void;
    selectedDay: {
        day: string,
        selectedAppointment: any
        isEditingExisting: boolean
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
}


const BookModal: React.FC<IBookModal> = ({isOpen, closeModal, selectedDay, employee, apolloClient}) => {
    const {register, handleSubmit, control, formState: {errors}, setValue, reset} = useForm<IAppointmentTemplate>({
        defaultValues: {
            client: '',
            description: '',
            date: '',
            instagram: '',
            procedure: 'manicure',
        }
    });
    const {selectedAppointment, isEditingExisting} = selectedDay;
    const createdBy = useTypedSelector(state => state.employee._id);
    const [addAppointment] = useMutation(CREATE_APPOINTMENT);
    const [updateAppointment] = useMutation(UPDATE_APPOINTMENT);
    const [deleteAppointment] = useMutation(DELETE_APPOINTMENT);
    const [showDeleteBtn, setShowDeleteBtn] = React.useState(false);
    useEffect(() => {
        if (selectedAppointment) {
            setValue('client', selectedAppointment.client);
            setValue('description', selectedAppointment.description);
            setValue('instagram', selectedAppointment.instagram);
            setValue('procedure', selectedAppointment.procedure);
            setValue('date', selectedAppointment.date);
            return
        }
        reset()

    }, [selectedAppointment]);
    useEffect(() => {
        if (!isOpen) {
            setShowDeleteBtn(false)
        }
    }, [isOpen])
    const onSubmit: SubmitHandler<IAppointmentTemplate> = async (appointmentTemplate) => {
        if (isEditingExisting) {
            const dateFromTS = new Date(+selectedAppointment.timestamp);
            selectedDay.day = `${dateFromTS.getFullYear()}_${dateFromTS.getMonth()}_${dateFromTS.getDate()}`;
        }

        const [year, month, day] = selectedDay.day.split('_');
        const [hour, minute] = appointmentTemplate.date.split(':');

        appointmentTemplate.date = String(dateToTimestamp(+year, +month, +day, +hour, +minute));
        appointmentTemplate.employee = employee;
        appointmentTemplate.creator = createdBy;
        try {
            if (isEditingExisting) {
                await updateAppointment({
                        variables: {
                            appointmentID: selectedAppointment.id,
                            AppointmentInput: appointmentTemplate
                        }
                    }
                );
            } else {
                await addAppointment({
                        variables: {
                            AppointmentInput: appointmentTemplate
                        }
                    }
                );
            }
            await apolloClient.refetchQueries({
                include: ['GET_APPOINTMENTS']
            });
            closeModal();
        } catch (e) {
            console.log(e);
        }

    }
    const onDelete = async () => {
        try {
            await deleteAppointment({
                variables: {
                    id: selectedAppointment.id
                }
            });
            await apolloClient.refetchQueries({
                include: ['GET_APPOINTMENTS']
            });
            closeModal();
        } catch (e) {
            console.log(e);
        }
    }
    return (
        <Modal
            open={isOpen}
            modalHeading={isEditingExisting ? 'Изменить запись' : 'Добавить запись'}
            modalLabel=''
            primaryButtonText={isEditingExisting ? 'Изменить' : 'Добавить'}
            secondaryButtonText='Назад'
            onRequestClose={closeModal}
            onRequestSubmit={handleSubmit(onSubmit)}
        >
            {(<form>
                <TextInput
                    labelText='Введите имя'
                    id='clientNameBook'
                    {...register("client", {required: true})}

                />
                {errors.client && <span className={errorSpan}>Это поле обязательно</span>}

                <Select
                    id='select-1'
                    labelText='Выберите процедуру'
                    {...register("procedure", {required: true})}
                >
                    <SelectItem value='manicure' text='Маникюр'/>
                    <SelectItem value='pedicure' text='Педикюр'/>
                </Select>
                <Controller
                    name="date"
                    control={control as any}
                    rules={{required: true}}
                    render={({field}) => <FormLabel className={timePickerCss}>
                        Выберите время
                        <TimePicker
                            timeFormat='HH:mm'
                            placeholder={' '}
                            times={mapTimeToTimepicker()}
                            appearance={'subtle'}
                            {...field}
                        />
                    </FormLabel>}
                />
                {errors.date && <span className={errorSpan}>Это поле обязательно</span>}


                <TextInput
                    labelText='профиль инстаграм'
                    id='name'
                    {...register("instagram")}
                />
                <TextArea
                    labelText='Комментарий'
                    placeholder='...'
                    helperText='необязательное поле'
                    {...register("description")}
                />

            </form>)}
            {isEditingExisting && (
                <div className={deleteBtn}>
                    {showDeleteBtn ? (
                        <Button
                            onClick={onDelete}
                            renderIcon={TrashCan32}
                            iconDescription='delete'
                            size='small'
                            kind='danger'
                        >Удалить запись</Button>
                    ) : (
                        <Button
                            onClick={() => {
                                setShowDeleteBtn(true)
                            }}
                            renderIcon={TrashCan32}
                            iconDescription='Delete'
                            hasIconOnly
                            size='small'
                            kind='ghost'
                        >Удалить</Button>
                    )}

                </div>
            )}

        </Modal>
    );
};

export default BookModal;
