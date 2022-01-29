const Expenses = require("../models/expenses-model");
const MonthController = require("./month-controller");
const MonthTotal = require("../models/month-total-model");

class ExpensesController {
  static async addNewExpense({ ExpenseInput }) {
    try {
      const month = await MonthController.getMonthByCode(
          ExpenseInput.monthCode
      );

      const newExpense = new Expenses({
        cash: ExpenseInput.cash,
        cashless: ExpenseInput.cashless,
        month: month,
        date: new Date(ExpenseInput.date),
        category: ExpenseInput.category,
        invoice: ExpenseInput.invoice,
        description: ExpenseInput.description,
      });

      const savedExpense = await newExpense.save();

      await MonthTotal.findByIdAndUpdate(month.id, {
        $push: { expenses: savedExpense },
      });

      return savedExpense;
    } catch (error) {
      console.log(error);
      throw error;
    }
  }

  static async editExpense({ ExpenseID, ExpenseInput }) {
    const expense = {
      cash: ExpenseInput.cash,
      cashless: ExpenseInput.cashless,
      category: ExpenseInput.category,
      invoice: ExpenseInput.invoice,
      description: ExpenseInput.description,
    };

    try {
      return await Expenses.findByIdAndUpdate(ExpenseID, expense, {
        new: true,
      });
    } catch (error) {
      throw error;
    }
  }

  static async deleteExpense({ ExpenseID }) {
    try {
      const expense = await Expenses.findById(ExpenseID);

      const month = await MonthTotal.findById(expense.month)
      month.expenses.pull(ExpenseID);
      await month.save();

      await Expenses.findByIdAndDelete(ExpenseID);

      return "success";
    } catch (error) {
      throw error;
    }
  }

  static async getExpensesByMonth({ monthCode }) {
    try {
      const month = await MonthController.getMonthByCode(monthCode);
      const res =  await Expenses.find({ month: month.id }).sort({ date: 1 });
      return res;
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ExpensesController;
