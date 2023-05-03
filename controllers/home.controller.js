const db = require('../models')
const Gym = db.gym
let allMemberships = db.membership
let classSchedule = db.class

exports.homeInfo = async (req, res) => {
  console.log('home info controller called.')
  //let membership = await db.membership.findAll()
  //res.status(200).json({ membership })
  const gymId = 1
  if (isNaN(gymId)) {
    return res.status(400).json({ error: 'Invalid gym ID' })
  }

  try {
    let gymInfo = await Gym.findByPk(gymId)
    console.log(gymInfo)
    if (!gymInfo) {
      return res.status(404).json({ error: 'Gym not found' })
    }

    let memberships = await gymInfo.getMemberships()
    console.log(memberships)
    classSchedule = await gymInfo.getClassSchedule()

    const response = {
      gym: gymInfo,
      memberships: memberships,
      classSchedule: classSchedule,
    }

    res.json(response)
  } catch (err) {
    console.error('Error fetching gym info: ' + err.stack)
    res.status(500).json({ error: 'Internal server error' })
  }
}

exports.gymInfo = async (req, res) => {
  console.log('gym info controller called.')
  try {
    const gyms = await Gym.findAll()
    res.json(gyms)
  } catch (error) {
    console.error(error)
    res.status(500).json({ error: 'An error occurred while retrieving gyms' })
  }
}

exports.getClassScheduleBasedOnGymLocation = async (req, res) => {
  console.log('getClassScheduleBasedOnGymLocation info controller called.')
  try {
    const gym = await Gym.findByPk(req.params.id, {
      include: [{ model: classSchedule }],
    })

    if (!gym) {
      return res.status(404).json({ error: 'gym not found' })
    }
    console.log(gym)
    res.json(gym)
  } catch (error) {
    console.error(error)
    res
      .status(500)
      .json({ error: 'An error occurred while retrieving schedules' })
  }
}
