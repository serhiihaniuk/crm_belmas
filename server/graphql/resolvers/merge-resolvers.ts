// @ts-nocheck
import Employee from '../../models/employee-model';
import Appointment from '../../models/appointment-model';

const getEmployeeFromDB = async (field, withPassword = false) => {
    try {
        const employee = await Employee.findOne({field});

        if (!withPassword) {
            employee._doc.password = null;
        }
        return {
            ...employee._doc,
            _id: employee.id,
            appointments: getAppointments.bind(this, employee._doc.appointments)
        };
    } catch (err) {
        throw err;
    }
};

const getAppointments = async (appointmentsIds) => {
    try {
        const queryFilter = appointmentsIds.length ? {_id: {$in: appointmentsIds}} : {};
        const appointments = await Appointment.find(queryFilter);
        return appointments.map((appointment) => {
            return {
                ...appointment._doc,
                _id: appointment.id,
                employee: getEmployeeFromDB.bind(this, appointment.employee)
            };
        });
    } catch (err) {
        throw err;
    }
};

export default {
    getEmployeeFromDB,
    getAppointments
};
