const Expenses = require("../models/expenses-model");
const MonthController = require("./month-controller");
const MonthTotal = require("../models/month-total-model");

class ExpensesController {
  static async addNewExpense({ expenseInput }) {
    try {
      const month = await MonthController.getMonthByCode(
        expenseInput.monthCode
      );
      const newExpense = new Expenses({
        cash: expenseInput.cash,
        cashless: expenseInput.cashless,
        month: month,
        date: Date.now(),
        category: expenseInput.category,
        invoice: expenseInput.invoice,
        description: expenseInput.description,
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

  static async editExpense({ expenseID, expenseInput }) {
    const expense = {
      cash: expenseInput.cash,
      cashless: expenseInput.cashless,
      category: expenseInput.category,
      invoice: expenseInput.invoice,
      description: expenseInput.description,
    };

    try {
      return await Expenses.findByIdAndUpdate(expenseID, expense, {
        new: true,
      });
    } catch (error) {
      throw error;
    }
  }

  static async deleteExpense({ expenseID }) {
    try {
      const expense = await Expenses.findById(expenseID);

      const month = await MonthTotal.findById(expense.month)
      month.expenses.pull(expenseID);
      await month.save();

      await Expenses.findByIdAndDelete(expenseID);

      return "success";
    } catch (error) {
      throw error;
    }
  }

  static async getExpensesByMonth({ monthCode }) {
    try {
      const month = await MonthController.getMonthByCode(monthCode);
      return await Expenses.find({ month: month.id });
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ExpensesController;
// 61bf440576440897fa4c5617
