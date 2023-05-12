
const {body , validationResult } = require("express-validator");

const LoginValidations = [

    body("email")
    .notEmpty()
    .withMessage("email is required")
    .isString()
    .withMessage("email should be string")
    .isEmail()
    .trim(),

    body("password")
    .notEmpty()
    .withMessage("password is required")
    .isString()
    .withMessage("password should be string")
    .trim()
   
];


const result = (req,res,next) => {

    const result = validationResult(req);
    const haserror = !result.isEmpty();

    if(haserror){

       const err = result.array()[0].msg;
      return res.send({sucess:false , message:err});
    }

    next();
};

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    if (typeof value === 'number' && value.toString().trim().length === 0 ) return false
    return true
};

const validRequestBody = function (requestBody) {
    return Object.keys(requestBody).length > 0
};

const vaildObjectId = function (objectId) {
    if (objectId.length == 24) return true
    return false
};

const isValidName = function (name)  {
    return /^[a-zA-Z ]{3,30}$/.test(name)
};


const isValidStatus = function(status) {
    return ['pending', 'completed', 'cancelled'].indexOf(status) !== -1
};


module.exports= {isValid,validRequestBody,vaildObjectId,
    isValidName,isValidStatus ,LoginValidations,result} 