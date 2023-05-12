
const express = require("express");
const app = express();
require("./config/databse");
const userRouter = require("./v1/routes/user_routes")
const doctorRouter = require("./v1/routes/doctor_routes")
const appointmentRouter = require("./v1/routes/appintment_routes")
const port = process.env.PORT || 3001



//middleware
app.use(express.json());
app.use(express.urlencoded({extended:false}))
app.use("/v1/users" , userRouter)
app.use("/v1/doctor" , doctorRouter)
app.use("/v1/appointment" , appointmentRouter)



// my Port
app.listen(port, () => console.log(`Example app listening on port ${port}!`));
