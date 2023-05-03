module.exports = (sequelize, Sequelize) => {
  const Membership = sequelize.define(
    'memberships',
    {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
      },
      name: {
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
    // tableName: 'memberships', // Add this option to set the table name
  )
  return Membership
}
//console.log(Membership)
