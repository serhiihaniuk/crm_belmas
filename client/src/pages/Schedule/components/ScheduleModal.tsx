import React, {useEffect} from 'react';

import {Modal, NumberInput, Select, SelectItem} from "carbon-components-react";
import {css} from "@emotion/css";
import {IScheduleTableRow} from "../service/tableService";
import {useForm, Controller} from "react-hook-form";
import {CALCULATE_APPOINTMENT} from "../../../gql/mutations/appointment";
import {useMutation} from "@apollo/client";


const modal = css`
  .bx--modal-container {
    width: 320px;
  }
`

interface IScheduleModalProps {
    client: any
    isOpen: boolean
    closeModal: () => void
    selectedAppointment: IScheduleTableRow | null
}

interface ICalculateAppointmentTemplate {
    id: string,
    price: number,
    paymentMethod: string,
}

const ScheduleModal: React.FC<IScheduleModalProps> = ({isOpen, closeModal, selectedAppointment, client}) => {
    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
        control,
    } = useForm<ICalculateAppointmentTemplate>({
        defaultValues: {
            id: '',
            price: 0,
            paymentMethod: '',
        }
    });
    const [calculateAppointment] = useMutation(CALCULATE_APPOINTMENT);

    useEffect(() => {
        if (selectedAppointment) {
            setValue('id', selectedAppointment.id)
            setValue('price', selectedAppointment.price)
            setValue('paymentMethod', selectedAppointment.paymentMethod)
        }
    }, [selectedAppointment, setValue])
    const onSubmit = async (data: ICalculateAppointmentTemplate) => {
        try {
            await calculateAppointment({
                variables: {
                    id: data.id,
                    price: +data.price,
                    paymentMethod: data.paymentMethod,
                }
            })
            await client.refetchQueries({
                include: ['GET_APPOINTMENTS']
            });
            closeModal();
        } catch (e) {
            console.log(e)
        }
    }
    return (
        <Modal
            open={isOpen}
            modalHeading={selectedAppointment?.status === "finished" ? "Редактирование записи" : "Рассчитать"}
            modalLabel=""
            primaryButtonText={selectedAppointment?.status === "finished" ? "Сохранить" : "Рассчитать"}
            secondaryButtonText="Назад"
            onRequestClose={closeModal}
            onRequestSubmit={handleSubmit(onSubmit)}
            className={modal}
        >
            <form>
                <Controller
                    name="price"
                    control={control as any}
                    rules={{required: true, min: 1}}
                    render={({field}) => <NumberInput
                        label="Стоимость"
                        id="calculatePrice"
                        light={true}
                        hideSteppers={true}
                        {...field}
                    />}
                />
                {errors.price && <span style={{color: 'red', height: 12, fontSize: 10}}>Это поле обязательно</span>}
                <Select id="select-1" defaultValue="placeholder-item" labelText="Способ оплаты"
                        {...register("paymentMethod", {required: true})}>
                    <SelectItem value="cash" text="Наличные"/>
                    <SelectItem value="cashless" text="Терминал"/>
                </Select>
                {errors.paymentMethod &&
                <span style={{color: 'red', height: 12, fontSize: 10}}>Это поле обязательно</span>}
            </form>
        </Modal>
    );
}

export default ScheduleModal
