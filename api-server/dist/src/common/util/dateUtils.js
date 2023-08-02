"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.generateDateList = exports.getDateList = exports.addOneDay = exports.addDaysToDate = exports.getDateDiff = exports.getDatestring = void 0;
function getDatestring() {
    const date = new Date();
    const year = date.getFullYear().toString();
    const month = (date.getMonth() + 1).toString().padStart(2, '0');
    const day = date.getDate().toString().padStart(2, '0');
    return `${year}${month}${day}`;
}
exports.getDatestring = getDatestring;
function getDateDiff(date1, date2) {
    const year1 = parseInt(date1.substring(0, 4));
    const month1 = parseInt(date1.substring(4, 6)) - 1;
    const day1 = parseInt(date1.substring(6, 8));
    const year2 = parseInt(date2.substring(0, 4));
    const month2 = parseInt(date2.substring(4, 6)) - 1;
    const day2 = parseInt(date2.substring(6, 8));
    const diffTime = new Date(year2, month2, day2).getTime() -
        new Date(year1, month1, day1).getTime();
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
}
exports.getDateDiff = getDateDiff;
function addDaysToDate(basedate, add) {
    const dateObj = new Date(`${basedate.substr(0, 4)}-${basedate.substr(4, 2)}-${basedate.substr(6, 2)}`);
    dateObj.setDate(dateObj.getDate() + add);
    const year = dateObj.getFullYear();
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const day = String(dateObj.getDate()).padStart(2, '0');
    return `${year}${month}${day}`;
}
exports.addDaysToDate = addDaysToDate;
function addOneDay(date) {
    return addDaysToDate(date, 1);
}
exports.addOneDay = addOneDay;
function getDateList(start, end) {
    const res = [];
    [start, end] = [addOneDay(start), addOneDay(end)];
    for (let day = start; day !== end; day = addOneDay(day)) {
        res.push(day);
    }
    return res;
}
exports.getDateList = getDateList;
function generateDateList(startDate, period) {
    const dateArray = [];
    const year = Number(startDate.substring(0, 4));
    const month = Number(startDate.substring(4, 6)) - 1;
    const day = Number(startDate.substring(6, 8));
    const currentDate = new Date(year, month, day);
    for (let i = 0; i < period; i++) {
        const year = currentDate.getFullYear();
        const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
        const day = currentDate.getDate().toString().padStart(2, '0');
        const formattedDate = `${year}${month}${day}`;
        dateArray.push(formattedDate);
        currentDate.setDate(currentDate.getDate() - 1);
    }
    return dateArray.reverse();
}
exports.generateDateList = generateDateList;
//# sourceMappingURL=dateUtils.js.map