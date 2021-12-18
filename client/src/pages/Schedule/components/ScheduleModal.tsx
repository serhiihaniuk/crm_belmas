import React, { useEffect } from 'react';

import {
    Modal,
    NumberInput,
    Select,
    SelectItem
} from 'carbon-components-react';
import { css } from '@emotion/css';
import { IScheduleTableRow } from '../service/tableService';
import { useForm, Controller } from 'react-hook-form';
import { CALCULATE_APPOINTMENT } from '../../../gql/mutations/appointment';
import { InlineLoading } from 'carbon-components-react';
import { useMutation } from '@apollo/client';

const modal = css`
    .bx--modal-container {
    width: 340px;
    }
`;

const loadingStyle = css`
    display: flex;
    justify-content: center;
    align-items: center;
    height: 136px;`


interface IScheduleModalProps {
    client: any;
    isOpen: boolean;
    closeModal: () => void;
    selectedAppointment: IScheduleTableRow | null;
}

interface ICalculateAppointmentTemplate {
    id: string;
    price: number;
    paymentMethod: string;
}

const ScheduleModal: React.FC<IScheduleModalProps> = ({
    isOpen,
    closeModal,
    selectedAppointment,
    client
}) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: { errors },
        control
    } = useForm<ICalculateAppointmentTemplate>({
        defaultValues: {
            id: '',
            price: 0,
            paymentMethod: ''
        }
    });
    const [calculateAppointment, { data, loading, error }] = useMutation(CALCULATE_APPOINTMENT);

    useEffect(() => {
        if (selectedAppointment) {
            const price =
                selectedAppointment.paymentMethod === 'cash'
                    ? selectedAppointment.cash
                    : selectedAppointment.cashless;
            setValue('id', selectedAppointment.id);
            setValue('price', price);
            setValue('paymentMethod', selectedAppointment.paymentMethod);
        }
    }, [selectedAppointment, setValue]);

    const onSubmit = async (data: ICalculateAppointmentTemplate) => {
        try {
            const cash = data.paymentMethod === 'cash' ? data.price : 0;
            const cashless = data.paymentMethod === 'cashless' ? data.price : 0;
            const variables = {
                id: data.id,
                cash: +cash,
                cashless: +cashless,
                paymentMethod: data.paymentMethod
            };
            await calculateAppointment({
                variables
            });
            await client.refetchQueries({
                include: ['GET_APPOINTMENTS_BY_DATE']
            });

        } catch (e) {
            console.log(e);
        }
        closeModal()
    };

    return (
        <Modal
            open={isOpen}
            modalHeading={
                selectedAppointment?.status === 'finished'
                    ? 'Редактирование записи'
                    : 'Рассчитать'
            }
            modalLabel=""
            primaryButtonText={
                selectedAppointment?.status === 'finished' ? 'Сохранить' : 'Рассчитать'
            }
            secondaryButtonText="Назад"
            onRequestClose={closeModal}
            onRequestSubmit={handleSubmit(onSubmit)}
            className={modal}
        >
            {loading && <InlineLoading className={loadingStyle} description='Загрузка' />}
            {!loading && <form>
                <Controller
                    name="price"
                    control={control as any}
                    rules={{ required: true, min: 1 }}
                    render={({ field }) => (
                        <NumberInput
                            label="Стоимость"
                            id="calculatePrice"
                            light={true}
                            hideSteppers={true}
                            {...field}
                        />
                    )}
                />
                {errors.price && (
                    <span style={{ color: 'red', height: 12, fontSize: 10 }}>
                        Это поле обязательно
                    </span>
                )}
                <Select
                    id="select-1"
                    defaultValue="placeholder-item"
                    labelText="Способ оплаты"
                    {...register('paymentMethod', { required: true })}
                >
                    <SelectItem value="cash" text="Наличные" />
                    <SelectItem value="cashless" text="Терминал" />
                </Select>
                {errors.paymentMethod && (
                    <span style={{ color: 'red', height: 12, fontSize: 10 }}>
                        Это поле обязательно
                    </span>
                )}
            </form>}

        </Modal>
    );
};

export default ScheduleModal;
