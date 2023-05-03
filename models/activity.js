const userModel = require('./userModel')
module.exports = (sequelize, Sequelize) => {
  const Activity = sequelize.define(
    'activities',
    {
      Id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      activityName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      duration: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      date: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: userModel,
          key: 'id',
        },
      },
    },
    {
      timestamps: false,
    },
  )
  return Activity
}
