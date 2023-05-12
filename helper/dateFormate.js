// Importing Dependencies
const moment = require('moment');


//set current timestamp
exports.set_current_timestamp = () => {
    return moment().format("X");
}

exports.set_current_timestamp_milliseconds = () => {
    return moment().valueOf();
}

//convert date to timestamp
exports.getDateFormat = () => {
    return moment().format("DD/MM/YYYY")    
}

exports.getFormatTime= () => {
    return moment().format("HH:MM")    
}
