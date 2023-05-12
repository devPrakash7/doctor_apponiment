
const router = require("express").Router();
const {LoginValidations , result} = require("../../validations/user.validations");
const {authenticate} = require("../../middleware/auth")
const { Signup , Login , logout , get_user,get_all_user,
    update_user,delete_all_notifications,mark_all_notifications_as_seen,change_password } = require("../controller/user");
const {upload} = require("../../middleware/multer");




// user_modules
router.post("/signUp" , upload.single('file') , Signup);
router.post("/login" ,LoginValidations, result,  Login);
router.get("/logout" , authenticate ,  logout);
router.get("/get_user" , authenticate ,  get_user)
router.get("/get_all_users" ,  get_all_user);
router.put("/update_user" , authenticate , update_user)
router.post("/change_password" , authenticate , change_password)




module.exports = router;