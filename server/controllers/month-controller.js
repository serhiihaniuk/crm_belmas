const MonthTotal = require("../models/month-total-model");

class MonthController {
  static async getMonthByCode(monthCode) {
    try {
      let month = await MonthTotal.findOne({ monthCode: monthCode });
      if (!month) {
        month = await this.createMonth(monthCode);
      }
      return month;
    } catch (e) {
      throw e;
    }
  }

  static async createMonth(monthCode) {
    const newMonth = new MonthTotal({
      monthCode: monthCode,
      month: monthCode.slice(-2),
      year: monthCode.substring(0, 4),
      cashlessAtTheBeginning: 0,
      cash: 0,
      cashless: 0,
    });
    try {
      return await newMonth.save();
    } catch (e) {
      throw e;
    }
  }

  static async getMonthStats(monthCode) {
    try {
      let month = await MonthTotal.findOne({ monthCode: monthCode }).populate(
        "appointments"
      );
      if (!month) {
        month = await this.createMonth(monthCode);
      }
      const totalEarnings = month.appointments.reduce(
        (acc, curr) => {
          acc.cash += curr.cash;
          acc.cashless += curr.cashless;
          return acc;
        },
        {
          cash: 0,
          cashless: 0,
        }
      );

      const updatedMonth = await MonthTotal.findOneAndUpdate(
        { monthCode: monthCode },
        {
          $set: {
            cash: totalEarnings.cash,
            cashless: totalEarnings.cashless,
          },
        },
        { new: true }
      );
      /*
       {
        _id: new ObjectId("61be21576efa3a9f29bb3176"),
        monthCode: '2021-12',
        month: '12',
        year: '2021',
        cashlessAtTheBeginning: 0,
        cash: 123,
        cashless: 112,
        __v: 0,
        appointments: [
          new ObjectId("61be286294521c3c8750a81a"),
          new ObjectId("61be396b85ecf2be1d2be37f"),
          new ObjectId("61be3fc614028397cdbcb472")
        ]
      }*/
      return updatedMonth;
    } catch (e) {
      throw e;
    }
  }
}

MonthController.getMonthStats("2021-12");

module.exports = MonthController;
