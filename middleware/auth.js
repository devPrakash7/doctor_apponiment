
const jwt = require("jsonwebtoken")
const userModel = require("../models/user");
const constants = require("../config/constants")


exports.authenticate = async (req, res, next) => {

    try {

        if (!req.header('Authorization')) return res.status(401).send({status:false , msg:" login failed or Unauthorized "})

        const token = req.header('Authorization').replace('Bearer ', '');
        if (!token) return res.status(400).send({status:false , msg:"invalid token"})

        const decoded = await jwt.verify(token, constants.ACCESS_AUTH_TOKEN);
        const user = await userModel.findOne({ _id: decoded._id })

        if (!user) return res.status(404).send({status:false , msg:"user not found"})
    
        req.token = token;
        req.user = user;

        next();
    } catch (err) {
        console.log(err)
        return res.status(5000).send({status:false , msg: err.message})
    }
}