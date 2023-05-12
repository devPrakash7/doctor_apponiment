const router = require("express").Router();
const {doctorValidations, results} = require("../../validations/doctor.validations");
const{apply_doctor ,mark_all_notifications_as_seen ,
delete_all_notifications , get_approved_all_doctor,
get_all_doctors,get_doctors_info ,
update_doctors_profile,get_appointments_by_doctor_id,
change_appointment_status,get_all_doctors,change_doctor_account_status} = require('../controller/doctor')
const {authenticate} = require('../../middleware/auth')




// Doctor_module
router.post("/apply_doctor_account" ,doctorValidations,results, authenticate , apply_doctor);
router.post("/mark_all_notifications_as_seen" , authenticate , mark_all_notifications_as_seen);
router.post("/delete_all_notifications" , authenticate , delete_all_notifications); 
router.get("/get_approved_doctors/:doctorId" , authenticate, get_approved_all_doctor)
router.get("/get_doctor" , authenticate , get_doctors)
router.get("/get_doctor_info" , authenticate , get_doctors_info)
router.put("/update_doctor_profile" , authenticate , update_doctors_profile)
router.get("/get_appointments_by_doctor_id" , authenticate , get_appointments_by_doctor_id)
router.post("/change-appointment-status" , authenticate , change_appointment_status)
router.get("/get_all_doctors" , authenticate , get_all_doctors)
router.post("/change-doctor-account-status" , authenticate , change_doctor_account_status)




module.exports = router;