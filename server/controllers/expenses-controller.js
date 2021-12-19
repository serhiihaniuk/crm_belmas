const Expenses = require("../models/expenses-model");
const MonthController = require("./month-controller");
const MonthTotal = require("../models/month-total-model");

class ExpensesController {
  static async addNewExpense({ newExpenseInput }) {
    try {
      const month = await MonthController.getMonthByCode(
        newExpenseInput.monthCode
      );
      const newExpense = new Expenses({
        cash: newExpenseInput.cash,
        cashless: newExpenseInput.cashless,
        month: month,
        date: Date.now(),
        category: newExpenseInput.category,
        invoice: newExpenseInput.invoice,
        description: newExpenseInput.description,
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

  static async editExpense(args) {
    const expense = {
      cash: args.cash,
      cashless: args.cashless,
      category: args.category,
      invoice: args.invoice,
      description: args.description,
    };
    try {
      return await Expenses.findByIdAndUpdate(args.id, expense, { new: true });
    } catch (error) {
      throw error;
    }
  }

  static async deleteExpense(args) {
    try {
      const expense = await Expenses.findById(args.id);
      const month = await MonthController.getMonthByCode(expense.month.code);
      await MonthTotal.findByIdAndUpdate(month.id, {
        $pull: { expenses: expense },
      });
      return await Expenses.findByIdAndDelete(args.id);
    } catch (error) {
      throw error;
    }
  }
}

module.exports = ExpensesController;
