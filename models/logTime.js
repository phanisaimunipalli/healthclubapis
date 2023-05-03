const userModel = require('./userModel')

module.exports = (sequelize, Sequelize) => {
  const LogTime = sequelize.define(
    'logtimes',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.STRING,
        allowNull: false,
        references: {
          model: userModel,
          key: 'id',
        },
      },
      checkInTime: {
        type: Sequelize.DATE,
        allowNull: false,
      },

      checkOutTime: {
        type: Sequelize.DATE,
        allowNull: true,
        defaultValue: null,
      },
    },
    {
      timestamps: false,
    },
  )
  return LogTime
}
