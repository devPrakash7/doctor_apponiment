
const {body , validationResult } = require("express-validator");


const appointmentValidations = [

    body("userId")
    .notEmpty()
    .withMessage("userId is required")
    .isString()
    .isLength({max:24})
    .withMessage("userId should be string")
    .trim(),

    body("doctorId")
    .notEmpty()
    .withMessage("doctorId is required")
    .isString()
    .isLength({max:24})
    .withMessage("doctorId should be string")
    .trim(),

];


const Result = (req,res,next) => {

    const result = validationResult(req);
    const haserror = !result.isEmpty();

    if(haserror){

       const err = result.array()[0].msg;
       res.send({sucess:false , message:err});
    }

    next();
};



module.exports = {appointmentValidations , Result}