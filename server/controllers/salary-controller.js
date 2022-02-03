const MonthController = require("./month-controller");
const EmployeeController = require("./employee-controller");
const Salary = require("../models/salary-model");
const MonthTotal = require("../models/month-total-model");
const SalaryPayment = require("../models/salary-payment-model");

class SalaryController {
  static async getSalaryTableByCode(salaryTableCode) {
    try {
      let salaryTable = await Salary.findOne({
        salaryTableCode: salaryTableCode,
      });
      if (!salaryTable) {
        salaryTable = await this.createSalaryTable(salaryTableCode);
      }
      return salaryTable;
    } catch (e) {
      throw e;
    }
  }

  static async createSalaryTable(salaryTableCode) {
    try {
      const [monthCode, employeeID] = salaryTableCode.split("_");
      const month = await MonthController.getMonthByCode(monthCode);
      const employee = await EmployeeController.getEmployee({
        _id: employeeID,
      });

      const newSalaryTable = new Salary({
        salaryTableCode: salaryTableCode,
        employee: employee,
        totalEarned: 0,
        payedCash: 0,
        payedCashless: 0,
        tips: 0,
        month: month,
        payments: [],
      });
      const newSalaryTableSaved = await newSalaryTable.save();
      await MonthTotal.findByIdAndUpdate(month.id, {
        $push: { salaryTables: newSalaryTable },
      });
      return newSalaryTableSaved;
    } catch (e) {
      throw e;
    }
  }

  static async addNewSalaryPayment({ SalaryPaymentInput }) {
    try {
      const month = await MonthController.getMonthByCode(
        SalaryPaymentInput.monthCode
      );

      const employee = await EmployeeController.getEmployee({
        _id: SalaryPaymentInput.id,
      });

      const salaryTable = await this.getSalaryTableByCode(
        SalaryPaymentInput.salaryTableCode
      );
      const newSalaryPayment = new SalaryPayment({
        cash: SalaryPaymentInput.cash,
        cashless: SalaryPaymentInput.cashless,
        month: month,
        date: new Date(SalaryPaymentInput.date),
        employee: employee,
      });

      const savedSalaryPayment = await newSalaryPayment.save();

      //push savedSalaryPayment to salaryTablePayments
      salaryTable.payments.push(savedSalaryPayment);

      return savedSalaryPayment;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }
}

module.exports = SalaryController;
