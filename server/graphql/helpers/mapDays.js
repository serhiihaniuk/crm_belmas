function mapDaysBetweenDates(startDate, endDate) {
    const daysBetweenDates = {};
    const startDateTimestamp = new Date(startDate).getTime();
    const endDateTimestamp = new Date(endDate).getTime();

    let currentDateTimestamp = startDateTimestamp;

    while (currentDateTimestamp <= endDateTimestamp) {
        const date = new Date(currentDateTimestamp);

        const day = date.getDate().toString().padStart(2, '0');
        const month = (date.getMonth() + 1).toString().padStart(2, '0');
        const fullDateName = `${date.getFullYear()}-${month}-${day}`;

        daysBetweenDates[fullDateName] = [];
        currentDateTimestamp += 86400000;
    }

    return daysBetweenDates;
}

function addOneDayToDate(dateString) {
    const date = new Date(dateString);
    const newDate = new Date(date.getTime());
    newDate.setDate(newDate.getDate() + 1);
    const day = newDate.getDate().toString().padStart(2, '0');
    const month = (newDate.getMonth() + 1).toString().padStart(2, '0');
    const fullDateName = `${newDate.getFullYear()}-${month}-${day}`;
    return fullDateName;
}

module.exports = {mapDaysBetweenDates, addOneDayToDate};
