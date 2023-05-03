const express = require("express");
const app = express();
const cors = require("cors");
const mysql = require("mysql");
const dotenv = require("dotenv");
const authController = require("../api/controllers/auth.controller");
const homeController = require("../api/controllers/home.controller");
const memberController = require("../api/controllers/member.controller");
const classController = require("../api/controllers/class.controller");

const { verifySignUp, authJwt } = require("../api/middleware");
const { verifySignIn } = require("../api/middleware");
const opt_controller = require("../api/controllers/options.controller");

app.use(cors());
app.use(express.json());

dotenv.config({ path: "./.env" });
app.get("/hello", function (req, res) {
  console.log(authJwt.isAdmin);
  res.send({ name: "maverick" });
});

const db = mysql.createConnection({
  host: process.env.host,
  user: process.env.user,
  password: process.env.password,
  database: process.env.database,
});

// const db = mysql.createConnection({
//   host: process.env.host,
//   user: process.env.user,
//   password: process.env.password,
//   database: process.env.database,
// })
db.connect((err) => {
  if (err) {
    console.log(err);
  } else {
    console.log("Mysql  connected");
  }
});

app.post(
  "/api/auth/signup",
  verifySignUp.signupValidationRules(),
  [verifySignUp.checkSignupValidation, verifySignUp.checkEmailExisted],
  authController.signup
);

app.options("/api/auth/signin", opt_controller.handleOptionReq);
app.post(
  "/api/auth/signin",
  verifySignIn.signInValidationRules(),
  [verifySignIn.checkSignInValidation],
  authController.signIn
);
// home page api
app.get("/api/home", homeController.homeInfo);

// Admin-only endpoint to see all gym members
app.get(
  "/api/allmembers/admin",
  [authJwt.verifyToken, authJwt.isAdmin],
  memberController.getAllMembersForAdmin
);

app.post(
  "/api/addnewmember/admin",
  verifySignUp.signupValidationRules(),
  [
    verifySignUp.checkSignupValidation,
    verifySignUp.checkEmailExisted,
    authJwt.verifyToken,
    authJwt.isAdmin,
  ],
  authController.signup
);
app.options("/api/checkin/:userId", opt_controller.handleOptionReq);
app.post(
  "/api/checkin/:userId",
  [authJwt.verifyToken, authJwt.isAdmin],
  memberController.checkInOfMembersByAdmin
);

app.options("/api/checkout/:userId", opt_controller.handleOptionReq);
app.put(
  "/api/checkout/:userId",
  [authJwt.verifyToken, authJwt.isAdmin],
  memberController.checkOutOfMembersByAdmin
);

// GET classes available for signup
app.get("/api/allClasses/", classController.classInfo);

app.post(
  "/api/enroll/:userId/:classId",
  [authJwt.verifyToken],
  memberController.enrollForClassesInAdvance
);

app.get(
  "/api/:userId/schedule",
  [authJwt.verifyToken],
  memberController.fetchUserClassSchedule
);

app.get(
  "/api/:userId/:value",
  [authJwt.verifyToken],
  memberController.getActivitiesByTimePeriod
);

// Get all gyms
app.get("/api/gyms", homeController.gymInfo);

// Get schedules for a specific location
app.get(
  "/api/gyms/:id/schedules",
  homeController.getClassScheduleBasedOnGymLocation
);

// Log activity
app.post(
  "/api/activity/:userId",
  [authJwt.verifyToken],
  memberController.logActivity
);

app.listen(3000, () => {
  console.log("app listening on port 3000");
});

module.exports = app;
