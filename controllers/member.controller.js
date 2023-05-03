const dotenv = require("dotenv");
dotenv.config();

const uuid = require("uuid");
const db = require("../models");
const Member = db.user;
const Role = db.role;
const UserRole = db.userRole;
const Enrollment = db.enrollment;
const { Op } = require("sequelize");
const classSchedule = db.classSchedule;
const LogTime = db.logTime;
const Activity = db.activity;
const moment = require("moment-timezone");
moment.tz.setDefault("Asia/Kolkata");

exports.getAllMembersForAdmin = async (req, res) => {
  console.log("getAllMembersForAdmin called!!!");
  try {
    console.log("###########", req.param.body);
    //{ where: { userId : { not: id } } }
    let members = await Member.findAll();
    console.log("member***** ", members);
    res.status(200).json(members);
  } catch (error) {
    console.error("Error member fetching info: " + error.stack);
    res.status(500).json({ error: error.message });
  }
};

exports.checkInOfMembersByAdmin = async (req, res) => {
  console.log("checkInOfMembersByAdmin called!!!");
  const userId = req.params.userId;
  // const checkInTime = req.body.checkInTime
  console.log(userId);
  try {
    // Find the user by ID
    const user = await Member.findByPk(userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid user ID" });
    }
    // Create a new logtime record with checkinTime
    let checkInTime = new Date();
    let checkOutTime = new Date();
    let logTime = await LogTime.create({ userId, checkInTime, checkOutTime });
    res.status(200).json({ message: "Check-in time saved", logTime });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

/* exports.getCheckInTimeOfMember = async (req, res) => {
  console.log('getCheckInTimeOfMember called!!!')
  try {
    const userId = req.params.userId
    console.log('userID', userId)
    // Get today's date
    //   const currentDate = new Date().toISOString().slice(0, 10)
    // const currentDate = moment.utc().format('YYYY-MM-DD HH:mm:ss')

    console.log(currentDate)

    // Query the database with the converted datetime
    const logTime = await LogTime.findOne({
      where: {
        userId: userId,
        checkInTime: {
          [Op.gte]: moment.utc(currentDate).startOf('day').toDate(),
          [Op.lt]: moment.utc(currentDate).endOf('day').toDate(),
        },
      },
      order: [['checkInTime', 'DESC']],
    })

     const logTime = await LogTime.findOne({
      where: {
        userId: userId,
        checkInTime: {
          [Op.gte]: new Date(currentDate),
          [Op.lt]: new Date(currentDate + 'T23:59:59.999Z'),
        },
      },
      order: [['checkInTime', 'DESC']],
    }) 
    console.log(logTime)
    if (logTime) {
      res.status(200).json({
        message: 'Recent CheckIn time ',
        checkinTime: logTime.checkInTime,
      })
      // res.json({ checkinTime: logTime.checkinTime })
    } else {
      res
        .status(404)
        .json({ message: 'Log time not found for user ID ' + userId })
    }
  } catch (err) {
    console.error(err)
    res.status(500).json({ message: 'Server error' })
  }
} */

exports.checkOutOfMembersByAdmin = async (req, res) => {
  console.log("checkOutOfMembersByAdmin called!!!");
  const userId = req.params.userId;
  //const checkOutTime = req.body.checkOutTime

  console.log(userId);
  // console.log('checkOutTime: ', checkOutTime)
  try {
    // Find the user by ID
    const user = await Member.findByPk(userId);
    if (!user) {
      return res.status(400).json({ message: "Invalid user ID" });
    }

    // Update the checkOutTime value
    // Find the log record for the user
    const logTime = await LogTime.findOne({ where: { userId: userId } });
    if (!logTime) {
      return res
        .status(400)
        .json({ message: "No log record found for the user" });
    }
    logTime.checkOutTime = new Date(); //  checkOutTime
    await logTime.save();
    res.status(200).json({ message: "Check-out time saved", logTime });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

exports.addNewMemberByAdmin = async (req, res) => {
  console.log("addNewMemberByAdmin called!!!");
  try {
    console.log("###########", req.body);
    const { firstname, lastname, email, password } = req.body;
    let NewMember = await Member.create({
      firstname,
      lastname,
      email,
      password,
    });
    res.status(200).json(NewMember);
  } catch (error) {
    console.error("Error member fetching info: " + error.stack);
    res.status(500).json({ error: error.message });
  }
};
exports.enrollForClassesInAdvance = async (req, res) => {
  console.log(" enrollForClassesInAdvance called");
  try {
    const userId = req.params.userId;
    const classId = req.params.classId;
    const days = req.body.days;
    console.log(days);
    // Check if the user and class exist
    const user = await Member.findByPk(userId);
    const cls = await classSchedule.findByPk(classId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (!cls) {
      return res.status(404).json({ message: "Class not found" });
    }

    // Check if the user is already enrolled in the class
    const enrollment = await Enrollment.findOne({
      where: { userId: userId, classId: classId },
    });

    /*  if (enrollment) {
      return res
        .status(409)
        .json({ message: 'User already enrolled in the class' })
    }
 */
    // Enroll the user in the class
    await Enrollment.create({
      userId: userId,
      classId: classId,
      enrollDate: new Date(),
      days: days,
    });

    res.status(201).json({ message: "Enrollment created successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.fetchUserClassSchedule = async (req, res) => {
  console.log(" fetchUserClassSchedule called");
  const memberId = req.params.userId;
  try {
    const enrollments = await Enrollment.findAll({
      where: { userId: memberId },
      include: [{ model: classSchedule, attributes: ["name", "startTime"] }],
    });
    if (!enrollments || enrollments.length === 0) {
      return res
        .status(404)
        .json({ message: "No enrollment found for member" });
    }
    const schedule = enrollments.map((enrollment) => ({
      classId: enrollment.classId,
      className: enrollment.classSchedule.name,
      classStartTime: enrollment.classSchedule.startTime,
      enrollDate: enrollment.enrollDate,
      days: enrollment.days,
    }));
    res.json(schedule);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error!" });
  }
};

async function getLastWeekActivities(req, res) {
  console.log("getLastWeekActivities called");
  const memberId = req.params.userId;
  const startDate = new Date();
  startDate.setDate(startDate.getDate() - 7);
  const startDateISO = startDate.toISOString().split("T")[0];
  console.log(`Start date: ${startDateISO}`);
  try {
    const enrollments = await Enrollment.findAll({
      where: {
        userId: memberId,
        enrollDate: { [Op.gte]: startDate },
      },
      include: [
        //{
        //  model: Member,
        //  attributes: ['id', 'first_name'],
        // },
        {
          model: classSchedule,
          attributes: ["classId", "name"],
        },
      ],
      attributes: ["userId", "enrollDate", "classId"],
    });
    return enrollments;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error!" });
  }
}

async function getLastMonthActivities(req, res) {
  console.log("getLastMonthActivities called");
  const memberId = req.params.userId;
  const lastMonth = new Date();
  lastMonth.setMonth(lastMonth.getMonth() - 1);

  console.log(`last Month: ${lastMonth}`);
  try {
    const enrollments = await Enrollment.findAll({
      where: {
        userId: memberId,
        enrollDate: {
          [Op.gte]: lastMonth,
        },
      },
      include: [
        //{
        //  model: Member,
        //  attributes: ['id', 'first_name'],
        // },
        {
          model: classSchedule,
          attributes: ["classId", "name"],
        },
      ],
      attributes: ["userId", "enrollDate", "classId"],
    });
    // res.json(enrollments)
    return enrollments;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error!" });
  }
}

async function getLast90DaysActivities(req, res) {
  console.log("getLast90DaysActivities called");
  const memberId = req.params.userId;
  const last90Days = new Date();
  last90Days.setDate(last90Days.getDate() - 90);

  console.log(`last 90Days: ${last90Days}`);
  try {
    const enrollments = await Enrollment.findAll({
      where: {
        userId: memberId,
        enrollDate: {
          [Op.gte]: last90Days,
        },
      },
      include: [
        //{
        //  model: Member,
        //  attributes: ['id', 'first_name'],
        // },
        {
          model: classSchedule,
          attributes: ["classId", "name"],
        },
      ],
      attributes: ["userId", "enrollDate", "classId"],
    });
    // res.json(enrollments)
    return enrollments;
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error!" });
  }
}

exports.getActivitiesByTimePeriod = async (req, res) => {
  console.log("getActivitiesByTimePeriod called");
  const memberId = req.params.userId;
  const timePeriod = req.params.value;
  console.log("time period: @@@@", timePeriod);
  let activities;
  switch (timePeriod) {
    case "last-week":
      activities = getLastWeekActivities;
      break;
    case "last-month":
      activities = getLastMonthActivities;
      break;
    case "last-90Days":
      activities = getLast90DaysActivities;
      break;
    default:
      activities = getLastWeekActivities;
      break;
  }

  try {
    const enrollments = await activities(req, res);
    res.json(enrollments);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error!" });
  }
};

exports.logActivity = async (req, res) => {
  console.log("logActivity called");
  try {
    const userId = req.params.userId;
    const activityName = req.body.activityName;
    console.log(activityName);
    const duration = req.body.duration;
    const date = req.body.date;
    const activity = await Activity.create({
      activityName,
      duration,
      date,
      userId,
    });
    res.json(activity);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal server error!" });
  }
};
