module.exports = (sequelize, Sequelize) => {
  const Enrollment = sequelize.define(
    'enroll',
    {
      id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        primaryKey: true,
        autoIncrement: true,
      },
      userId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'userModel',
          key: 'id',
        },
      },
      classId: {
        type: Sequelize.INTEGER,
        allowNull: false,
        references: {
          model: 'Class',
          key: 'id',
        },
      },
      enrollDate: {
        type: Sequelize.DATE,
        allowNull: false,
      },
      days: {
        type: Sequelize.STRING,
        allowNull: true,
      },
    },
    {
      timestamps: false,
    },
  )
  return Enrollment
}
