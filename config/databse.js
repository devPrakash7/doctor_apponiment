
const mongoose = require("mongoose");
const constants = require("../config/constants")


mongoose
    .connect(constants.DATA_BASE_URL, {

        useNewUrlParser: true,
    })
    .then(() => {
        console.log("running port........");
    })
    .catch((error) => {

        console.log(error);
    });
