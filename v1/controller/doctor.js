const dateformate = require("../../helper/dateFormate");
const { doctorModel } = require("../../models/doctor.model");
const userModel = require("../../models/user");
const { appointmentModel } = require("../../models/appointment.model");
const message = require("../../config/message");

exports.apply_doctor = async (req, res) => {
  try {
    const reqBody = req.body;
    const admin = await userModel.findOne({ isAdmin: true });

    if (!admin) {
      return res
        .status(400)
        .send({ status: false, msg: message.DOCTOR.access_admin });
    }

    reqBody.created_at = await dateformate.set_current_timestamp();
    reqBody.updated_at = await dateformate.set_current_timestamp();
    reqBody.userId = admin._id.toString();
    const newDoctor = new doctorModel(reqBody);
    await newDoctor.save();

    const unseenNotifications = admin.unseenNotifications;
    unseenNotifications.push({
      type: "new-doctor-request",
      message: `${newDoctor.firstName} ${newDoctor.lastName} has applied for a doctor account`,
      data: {
        doctorId: newDoctor._id,
        name: newDoctor.firstName + " " + newDoctor.lastName,
      },
    });

    await userModel.findByIdAndUpdate(admin._id, { unseenNotifications });
    res.status(200).send({
      success: true,
      message: message.DOCTOR.doctor_sucessfully,
    });
  } catch (err) {
    console.log("apply_doctor_account....");
    console.log(err);
    return res
      .status(500)
      .send({ status: false, msg: message.GENERAL.general_error_content });
  }
};

exports.get_approved_all_doctor = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;

    if (!doctorId) {
      return res
        .status(404)
        .send({ status: false, msg: message.DOCTOR.doctorId_not_found });
    }

    const doctor = await doctorModel.findOne({ _id: doctorId });
    console.log(doctor);

    if (doctor.status === "pending") {
      await doctorModel.updateOne(
        { _id: doctorId },
        { $set: { status: "approved" } },
        { new: true }
      );
    }

    const doctors = await doctorModel.find({ status: "approved" });

    res.status(200).send({
      message: message.DOCTOR.approve_doctors_success,
      success: true,
      data: doctors,
    });
  } catch (err) {
    console.log("get_approved_all_doctor ....");
    console.log(err);
    return res
      .status(500)
      .send({ status: false, msg: message.GENERAL.general_error_content });
  }
};

exports.get_doctors = async (req, res) => {
  try {
    const user = await doctorModel.findOne({ userId: req.user._id});

    if (!user) {
      returnres
        .status(404)
        .send({ status: false, msg: message.USER.userid_not_found });
    }

    res.status(200).send({
      success: true,
      message: message.DOCTOR.approve_doctors_success,
      data: user,
    });
  } catch (err) {
    console.log("get_doctor....");
    console.log(err);
    return res
      .status(500)
      .send({ status: false, msg: message.GENERAL.general_error_content });
  }
};

exports.get_doctors_info = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ _id: req.user._id });
    res.status(200).send({
      success: true,
      message: message.DOCTOR.doctors_success,
      data: doctor,
    });
  } catch (err) {
    console.log("get_doctors_doctor_info....");
    console.log(err);
    return res
      .status(500)
      .send({ status: false, msg: message.GENERAL.general_error_content });
  }
};

exports.get_all_doctors = async (req, res) => {
  try {
    const doctor = await doctorModel.find({});

    if (!doctor) {
      return res
        .status(404)
        .send({ status: false, msg: "Doctors data not found" });
    }

    res.status(200).send({
      success: true,
      message: message.DOCTOR.get_doctors_sucess,
      data: doctor,
    });
  } catch (err) {
    console.log("get_all_doctors....");
    console.log(err);
    return res
      .status(500)
      .send({ status: false, msg: message.GENERAL.general_error_content });
  }
};

exports.update_doctors_profile = async (req, res) => {
  try {
    const doctor = await doctorModel.findOneAndUpdate(
      { userId: req.user._id },
      req.body,
      { new: true }
    );
    if (!doctor) {
      return res
        .status(404)
        .send({ status: false, msg: "userId is worng , cant updated" });
    }

    res.status(200).send({
      success: true,
      message: message.DOCTOR.update_doctor_sucess,
      data: doctor,
    });
  } catch (err) {
    console.log("update_doctors_profile....");
    console.log(err);
    return res
      .status(500)
      .send({ status: false, msg: message.GENERAL.general_error_content });
  }
};

exports.get_appointments_by_doctor_id = async (req, res) => {
  try {
    const doctor = await doctorModel.findOne({ userId: req.user._id });
    const appointments = await appointmentModel.find({ doctorId: doctor._id });

    if (!doctor && !appointments) {
      return res
        .status(404)
        .send({ status: false, msg: "DoctorId and UserId not found" });
    }

    res.status(200).send({
      message: message.DOCTOR.appointment_sucess,
      success: true,
      daa: appointments,
    });
  } catch (err) {
    console.log("get_appointments_by_doctor_id....");
    console.log(err);
    return res
      .status(500)
      .send({ status: false, msg: message.GENERAL.general_error_content });
  }
};

exports.change_appointment_status = async (req, res) => {
  try {
    const { appointmentId, status } = req.body;
    const appointment = await appointmentModel.findByIdAndUpdate(
      appointmentId,
      {
        status,
      }
    );

    const user = await userModel.findOne({ _id: appointment.userId });
    const unseenNotifications = user.unseenNotifications;
    unseenNotifications.push({
      type: "appointment-status-changed",
      message: `Your appointment status has been ${status}`,
    });

    await user.save();

    res.status(200).send({
      message: message.DOCTOR.status_update,
      success: true,
    });
  } catch (err) {
    console.log("change-appointment-status....");
    console.log(err);
    return res
      .status(500)
      .send({ status: false, msg: message.GENERAL.general_error_content });
  }
};

exports.change_doctor_account_status = async (req, res) => {
  try {
    const { doctorId, status } = req.body;
    const doctor = await doctorModel.findByIdAndUpdate(
      doctorId,
      { status },
      { new: true }
    );

    const user = await userModel.findOne({ _id: doctor.userId });
    const unseenNotifications = user.unseenNotifications;
    unseenNotifications.push({
      type: "new-doctor-request-changed",
      message: `Your doctor account has been ${status}`,
    });
    user.isDoctor = status === "approved" ? true : false;
    await user.save();

    res.status(200).send({
      message: message.DOCTOR.get_appointments,
      success: true,
      data: doctor,
    });
  } catch (err) {
    console.log("change_doctor_account_status....");
    console.log(err);
    return res
      .status(500)
      .send({ status: false, msg: message.GENERAL.general_error_content });
  }
};
