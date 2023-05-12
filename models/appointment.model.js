const mongoose = require("mongoose");


const appointmentSchema = new mongoose.Schema(
  {
    userId: {
      type: String,
    },
    doctorId: {
      type: String,
    },
    doctorInfo: {
      type: Object,
    
    },
    userInfo: {
      type: Object,
    },
    date: {
      type: String,
    },
    time: {
      type: String,
    },
    status: {
      type: String,
      default: "pending",
    },
    created_at:{type:Number},
    updated_at:{type:Number}
  },
 
);

const appointmentModel = mongoose.model("appointmenst", appointmentSchema);
module.exports = {appointmentModel};