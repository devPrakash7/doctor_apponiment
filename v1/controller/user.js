const userModel = require("../../models/user");
const bcrypt = require("bcrypt");
const dateFormat = require("../../helper/dateFormate");
const constants = require("../../config/constants");
const {
  userSave,
  getUser,
  getAllUser,
  updateUser,
} = require("../service/user.service");
const jwt = require("jsonwebtoken");
const validator = require("../../validations/user.validations");
const message = require("../../config/message");

exports.Signup = async (req, res) => {
  try {
    const reqBody = req.body;

    const { username, email, password } = reqBody;

    if (!validator.isValidName(username)) {
      return res
        .status(400)
        .send({ status: false, message: "userName is required" });
    }

    if (!validator.isValid(username)) {
      return res
        .status(400)
        .send({ status: false, message: "userName is required" });
    }

    if (!validator.isValid(email)) {
      return res
        .status(400)
        .send({ status: false, message: "Email is required" });
    }
    //check for valid mail
    if (!email.match(/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/)) {
      return res.status(400).send({ status: false, message: "Invalid Mail" });
    }

    const duplicateEmail = await userModel.findOne({ email });

    if (duplicateEmail) {
      return res
        .status(400)
        .send({ status: false, msg: "Email is exist try to another email" });
    }

    if (!validator.isValid(password)) {
      return res
        .status(400)
        .send({ status: false, message: "Password is required" });
    }
    //check for password length
    if (!(password.trim().length >= 8 && password.length <= 15)) {
      return res.status(400).send({
        status: false,
        message: "Password should have length in range 8 to 15",
      });
    }

    reqBody.password = await bcrypt.hash(password, 10);
    reqBody.created_at = await dateFormat.set_current_timestamp();
    reqBody.updated_at = await dateFormat.set_current_timestamp();
    let file = req.file;
    console.log(file);
    reqBody.profile_image = file.originalname;
    const user = await userSave(reqBody);
    user.password = undefined;
    return res
      .status(200)
      .send({ status: true, msg: message.USER.signUp_success, data: user });
  } catch (err) {
    console.log("Signup....");
    console.log(err);
    return res
      .status(500)
      .send({ status: false, msg: message.GENERAL.general_error_content });
  }
};

exports.Login = async (req, res) => {
  try {
    const { email, password } = req.body;

    let user = await userModel.findOne({ email });

    if (!user)
      return res.status(400).send({
        status: false,
        message: message.USER.login_Invalid,
      });

    const validPassword = await bcrypt.compare(password, user.password);

    if (!validPassword) {
      return res
        .status(400)
        .send({ status: false, msg: message.USER.password_Not_match });
    }

    const refresh_tokens = await jwt.sign(
      {
        _id: user._id.toString(),
      },
      constants.ACCESS_AUTH_TOKEN,
      { expiresIn: "1y" }
    );
    user.refresh_tokens = refresh_tokens;
    user.token = refresh_tokens;
    user.updated_at = await dateFormat.set_current_timestamp();
    await user.save();
    user.password = undefined;
    return res
      .status(200)
      .send({ status: true, msg: message.USER.login_success, data: user });
  } catch (err) {
    console.log("Login....");
    console.log(err);
    return res
      .status(500)
      .send({ status: false, msg: message.GENERAL.general_error_content });
  }
};

exports.logout = async (req, res) => {
  try {
    let UserData = await userModel.findById(req.user._id);

    UserData.token = "";
    UserData.refresh_tokens = "";

    await UserData.save();
    return res
      .status(200)
      .send({ status: true, msg: message.USER.logout_success });
  } catch (err) {
    console.log("Logout....");
    console.log(err);
    return res
      .status(500)
      .send({ status: false, msg: message.GENERAL.general_error_content });
  }
};

exports.change_password = async (req, res) => {
  try {
    const { old_password, new_password, confirm_password } = req.body;

    if (new_password !== confirm_password) {
      return res.status(400).send({
        status: false,
        msg: message.USER.password_not_match,
      });
    }

    const userId = req.user.id;
    console.log(userId);

    let user = await userModel.findById(userId);

    if (!user)
      return res
        .status(404)
        .send({ status: false, message: message.USER.user_not_found });

    user.password = await bcrypt.hash(new_password, 10);
    user.updated_at = await dateFormate.set_current_date();

    let data = await bcrypt.compare(new_password, user.password);
    console.log(data);
    const changePassword = await updateUser({ _id: user._id.toString() }, user);
    console.log(changePassword);

    return res.status(200).send({
      status: true,
      msg: message.USER.change_password,
      data: changePassword,
    });
  } catch (err) {
    console.log("change_password....");
    console.log(err);
    return res
      .status(500)
      .send({ status: false, msg: message.GENERAL.general_error_content });
  }
};

exports.get_user = async (req, res) => {
  try {
    const users = req.user.id;
    console.log(users);
    if (!users)
      return res
        .status(404)
        .send({ status: false, message: message.USER.userid_not_found });

    let user = await getUser(users);

    if (!user)
      return res
        .status(404)
        .send({ status: false, message: message.USER.user_not_found });

    return res
      .status(200)
      .send({ status: true, msg: message.USER.user_sucessfully, data: user });
  } catch (err) {
    console.log("get_user....");
    console.log(err);
    return res.status(500).send({ status: false, msg: err.message });
  }
};

exports.get_all_user = async (req, res) => {
  try {
    let user = await getAllUser();

    if (!user)
      return res
        .status(404)
        .send({ status: false, message: message.USER.user_not_found });

    return res
      .status(200)
      .send({ status: true, msg: message.USER.user_sucessfully, data: user });
  } catch (err) {
    console.log("get_all_user....");
    console.log(err);
    return res
      .status(500)
      .send({ status: false, msg: message.GENERAL.general_error_content });
  }
};

exports.update_user = async (req, res) => {
  try {
    const reqBody = req.body;

    const { email, username } = reqBody;

    if (!reqBody)
      return res
        .status(400)
        .send({ status: false, message: "can't update the data" });

    const findUser = req.user.id;

    if (!findUser)
      return res
        .status(404)
        .send({ status: false, message: message.USER.user_not_found });

    let user = await userModel.findOneAndUpdate({ _id: findUser }, req.body, {
      new: true,
    });

    if (!user)
      return res
        .status(404)
        .send({ status: false, message: message.USER.user_data_not_found });

    user.updated_at = await dateFormat.set_current_date();

    return res.status(200).send({
      status: true,
      msg: message.USER.user_update_sucessfully,
      data: user,
    });
  } catch (err) {
    console.log("update_user....");
    console.log(err);
    return res
      .status(500)
      .send({ status: false, msg: message.GENERAL.general_error_content });
  }
};

exports.mark_all_notifications_as_seen = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });

    if (!user) {
      return res
        .status(400)
        .send({ status: false, msg: message.USER.user_not_found });
    }

    const unseenNotifications = user.unseenNotifications;

    const seenNotifications = user.seenNotifications;

    seenNotifications.push(...unseenNotifications);

    user.unseenNotifications = [];

    user.seenNotifications = seenNotifications;

    const updatedUser = await user.save();
    updatedUser.password = undefined;
    res.status(200).send({
      success: true,
      message: message.USER.user_notification,
      data: updatedUser,
    });
  } catch (err) {
    console.log("mark_all_notifications_as_seen....");
    console.log(err);
    return res
      .status(500)
      .send({ status: false, msg: message.GENERAL.general_error_content });
  }
};

exports.delete_all_notifications = async (req, res) => {
  try {
    const user = await userModel.findOne({ _id: req.body.userId });

    if (!user) {
      return res
        .status(400)
        .send({ status: false, msg: message.USER.user_not_found });
    }

    user.unseenNotifications = [];

    user.seenNotifications = [];

    const delete_notifications = await user.save();
    delete_notifications.password = undefined;

    res.status(200).send({
      success: true,
      message: message.USER.delete_notification,
      data: delete_notifications,
    });
  } catch (err) {
    console.log("delete_all_notifications....");
    console.log(err);
    return res
      .status(500)
      .send({ status: false, msg: message.GENERAL.general_error_content });
  }
};
