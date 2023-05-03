const db = require('../models')
let Classes = db.class

exports.classInfo = async (req, res) => {
  console.log('classInfo  controller called.')
  //let membership = await db.membership.findAll()
  //res.status(200).json({ membership })

  try {
    let classes = await Classes.findAll()
    console.log(classes)
    if (!classes) {
      return res.status(404).json({ error: 'classes not found' })
    }

    const response = {
      classes: classes,
    }
    res.status(200).json(classes)
  } catch (err) {
    console.error('Error fetching class info: ' + err.stack)
    res.status(500).json({ error: 'Internal server error' })
  }
}
