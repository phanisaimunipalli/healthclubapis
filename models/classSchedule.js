module.exports = (sequelize, Sequelize) => {
  const Class = sequelize.define(
    'classSchedules',
    {
      classId: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      startTime: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      endTime: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      days: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      gymId: {
        type: Sequelize.INTEGER,
        allowNull: false,
      },
    },
    {
      timestamps: false,
    },
  )
  return Class
}
