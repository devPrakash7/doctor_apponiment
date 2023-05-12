
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");



let userSchema = new mongoose.Schema({

    username: {
        type: String,
        required: true,
      },
      email: {
        type: String,
        required: true,
      },
      password: {
        type: String,
        required: true,
      },
      isDoctor: {
        type: Boolean,
        default: false,
      },
      isAdmin: {
        type: Boolean,
        default: false,
      },
      seenNotifications: {
        type: Array,
        default: [],
      },
      unseenNotifications: {
        type: Array,
        default: [],
      },
      token:{type:String , default:null},
      refresh_tokens:{type:String , default:null},
      profile_image:{type:String},
      created_at:{type:Number},
      updated_at:{type:Number}

});

userSchema.methods.validPassword = (password) => {

     return bcrypt.compareSync(password , this.password)
}

//Output data to JSON
userSchema.methods.toJSON = function() {
    var user = this;
    var userObject = user.toObject();
    return userObject;
};


const userModel = mongoose.model("user" , userSchema);
module.exports = userModel;