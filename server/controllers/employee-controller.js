const Employee = require("../models/employee-model");
const AppointmentController = require("./appointment-controller");

class EmployeeController {
    async getEmployee (query, withPassword = false)  {
        try {
            const employee = await Employee.findOne({ query });

            if(!withPassword) {
                employee._doc.password = null;
            }

            return {
                ...employee._doc,
                _id: employee.id,
                appointments: []
            };
        } catch (err) {
            throw err;
        }
    };
    async getEmployees (query)  {

        try {

            const employees = await Employee.find( query );
            return employees.map(employee =>{
                return {
                    ...employee._doc,
                    _id: employee.id,
                };
            })

        } catch (err) {
            throw err;
        }
    };

}
module.exports = new EmployeeController();
