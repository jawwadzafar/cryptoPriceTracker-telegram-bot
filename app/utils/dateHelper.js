var moment = require('moment');

var format = {
    date: 'D/M/YYYY',
    dateDashed: 'YYYY-M-D',
    timeStamp: 'D/M/YYYY hh:mm:ss',
    isoString: 'YYYY-M-D hh:mm:ss',
    time: 'hh:mm:ss'
};

//Convert ISO Date to timestamp
var isoDateToUnix = function (input) {
    let convertedValue = moment(input, format.isoString).unix();
    if (!convertedValue) return 0;
    else return convertedValue;
};
var dashedDateToUnix = function (input) {
    let convertedValue = moment(input, format.dateDashed).unix();
    if (!convertedValue) return 0;
    else return convertedValue;
};


//Current Timestamp
var unixTimestamp = function () {
    return moment().unix();
};

//Convert date to timestamp
var dateToUnix = function (input) {
    return moment(input, format.timeStamp).unix();
};


//Convert to full date
var unixToFullDate = function (input) {
    return moment(moment.unix(input)).utcOffset("+05:30").format(format.timeStamp);
};

//Convert to date
var unixToDate = function (input) {
    return moment(moment.unix(input)).utcOffset("+05:30").format(format.date);
};

//Convert to time
var unixToTime = function (input) {
    return moment(moment.unix(input)).utcOffset("+05:30").format(format.time);
};

//Add minutes to timestamp
var addToTimestamp = function (input) {
    return unixTimestamp() + input * 60;
};

//Difference in sec
var diff = function (low, high) {
    return moment(high).diff(low);
};

var docPrefix = function () {
    return moment().format("YYYY_MMM_DD_");
};
var unix = function(){
    return moment().unix();
}
//Add days to timestamp
function unixAddDays(input) {
    return unix() + input * 60 * 60 * 24;
  }

  //Add days to timestamp
function unixAddMinutes(input) {
    return unix() + input * 60;
  }
  

let diffSec = (high, low)=>{return moment.unix(high).diff(moment.unix(low), 'seconds')};

module.exports = {
    isoDateToUnix: isoDateToUnix,
    dashedDateToUnix: dashedDateToUnix,
    // needed above
    unixTimestamp: unixTimestamp,
    dateToUnix: dateToUnix,
    unixToFullDate: unixToFullDate,
    unixToDate: unixToDate,
    unixToTime: unixToTime,
    addToTimestamp: addToTimestamp,
    diff: diff,
    diffSec: diffSec,
    unix:unix,
    docPrefix: docPrefix,
    unixAddDays:unixAddDays,
    unixAddMinutes:unixAddMinutes,
};