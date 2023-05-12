
const {appointmentModel} = require("../../models/appointment.model")
const userModel = require("../../models/user");
const dateformate = require("../../helper/dateFormate");
const { doctorModel } = require("../../models/doctor.model");
const moment = require("moment");
const message = require("../../config/message");



exports.book_appointment = async (req ,res) => {

    try{

        const user = await userModel.findOne({ _id:req.user._id});
        user.unseenNotifications.push({
            type: "new-appointment-request",
            message: `A new appointment request has been made by ${user.username}`,
          });
        const doctor = await doctorModel.findOne({ _id: req.body.doctorId});
        req.body.doctorInfo = doctor
        req.body.userInfo = user;
        req.body.status = "pending";
        req.body.date = await dateformate.getDateFormat()
        req.body.time = await dateformate.getFormatTime()
        req.body.created_at = await dateformate.set_current_timestamp()
        req.body.updated_at = await dateformate.set_current_timestamp()

        const newAppointment = new appointmentModel(req.body);
        await newAppointment.save();
        res.status(201).send({
          message: message.appointment.book_appointment,
          success: true,
        });

  }catch(err){

    console.log('book-appointment....')
    console.log(err)
    return res.status(500).send({status:false , msg:message.GENERAL.general_error_content})
 }
}



exports.check_booking_avilability = async(req , res) => {

  try{

    const date = moment(req.body.date, "DD-MM-YYYY").toISOString();
    const fromTime = moment(req.body.time, "HH:mm")
      .subtract(1, "hours")
      .toISOString();
    const toTime = moment(req.body.time, "HH:mm").add(1, "hours").toISOString();
    const doctorId = req.body.doctorId;
    console.log(doctorId)
    let data = await appointmentModel.findOne({doctorId})
    console.log(data)
    const appointments = await appointmentModel.find({
      doctorId,
       date,
       time: { $gte: fromTime, $lte: toTime },
    });
 
    if (appointments.length > 0) {
      return res.status(200).send({
        message: message.appointment.not_available,
        success: false,
      });
    } else {
      return res.status(200).send({
        message: message.appointment.available,
        success: true,
        data:appointments
      });
    }

}catch(err){

     console.log('check-booking-avilability....')
     console.log(err)
     return res.status(500).send({status:false , msg:message.GENERAL.general_error_content})
  }
}

exports.get_appointments = async(req , res) => {

  try{
    
    const appointments = await appointmentModel.find({userId: req.user._id});
    res.status(200).send({
      message: message.appointment.appointment_fetch_sucess,
      success: true,
      data: appointments,
    })

}catch(err){

     console.log('get_appointments......')
     console.log(err)
     return res.status(500).send({status:false , msg:message.GENERAL.general_error_content})
  }
}