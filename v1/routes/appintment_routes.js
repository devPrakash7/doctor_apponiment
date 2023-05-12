
const router = require("express").Router();
const {appointmentValidations , Result} = require("../../validations/appointment.validation")
const {book_appointment , check_booking_avilability,get_appointments} = require('../controller/appointment.controller')
const {authenticate} = require('../../middleware/auth')



router.post("/book_appointment" , appointmentValidations,Result, authenticate , book_appointment)

router.post("/check-booking-avilability" , authenticate , check_booking_avilability)

router.get("/get_appointments/:userId" , authenticate , get_appointments)



module.exports = router