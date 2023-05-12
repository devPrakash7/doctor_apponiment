
const mongoose = require("mongoose");


let doctorSchema = new mongoose.Schema({

        userId: {
          type: String,
          default:null
        },
        firstName: {
          type: String,
          required: true,
        },
        lastName: {
          type: String,
          required: true,
        },
        phoneNumber: {
          type: String,
          required: true,
        },
        website: {
          type: String,
          required: true,
        },
        address: {
          type: String,
          required: true,
        },
        specialization: {
          type: String,
          required: true,
        },
        experience: {
          type: String,
          required: true,
        },
        feePerCunsultation: {
          type: Number,
          required: true,
        },
        timings : {
          type: Array,
          required: true,
        },
        status: {
          type: String,
          default: "pending",
        },
      created_at:{type:Number},
      updated_at:{type:Number}

});


//Output data to JSON
doctorSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return userObject;
};


const doctorModel = mongoose.model("doctors" , doctorSchema);
module.exports = {doctorModel};