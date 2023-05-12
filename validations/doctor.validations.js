
const {body , validationResult } = require("express-validator");


const doctorValidations = [

    body("userId")
    .isString()
    .isLength({max:24})
    .withMessage("userId should be string")
    .trim(),

    body("firstName")
    .notEmpty()
    .withMessage("firstName is required")
    .isString()
    .withMessage("firstName should be string")
    .trim(),

    body("lastName")
    .notEmpty()
    .withMessage("lastName is required")
    .isString()
    .withMessage("lastName should be string")
    .trim(),

    body("phoneNumber")
    .notEmpty()
    .withMessage("phoneNumber is required")
    .isString()
    .isLength({max:10})
    .withMessage("phoneNumber should be boolean")
    .trim(),

    body("website")
    .notEmpty()
    .withMessage("website is required")
    .isString()
    .withMessage("website should be boolean")
    .trim(),

    body("address")
    .notEmpty()
    .withMessage("address is required")
    .isString()
    .withMessage("address should be string")
    .trim(),

    body("specialization")
    .notEmpty()
    .withMessage("specialization is required")
    .isString()
    .withMessage("specialization should be string")
    .trim(),

    body("experience")
    .notEmpty()
    .withMessage("experience is required")
    .isString()
    .withMessage("experience should be string")
    .trim(),
   
    body("feePerCunsultation")
    .notEmpty()
    .withMessage("feePerCunsultation is required")
    .isNumeric()
    .withMessage("feePerCunsultation should be string")
    .trim(),

    body("timings")
    .notEmpty()
    .withMessage("timings is required")
    .isString()
    .withMessage("timings should be string")
    .trim(),

    body("status")
    .isString()
    .withMessage("status should be string")
    .trim(),
];


const results = (req,res,next) => {

    const result = validationResult(req);
    const haserror = !result.isEmpty();

    if(haserror){

       const err = result.array()[0].msg;
       res.send({sucess:false , message:err});
    }

    next();
};


module.exports = {doctorValidations, results}