/* module.exports = (sequelize, Sequelize) => {
  const UserRole = sequelize.define('user_roles', {
     id: {
      type: Sequelize.INTEGER,
      primaryKey: true,
      autoIncrement: true,
      allowNull: false,
    }, 
    userId: {
      type: Sequelize.UUID,
      allowNull: false,
    },
    roleId: {
      type: Sequelize.INTEGER,
      allowNull: false,
    },
    createdAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal('CURRENT_TIMESTAMP'),
    },
    updatedAt: {
      type: Sequelize.DATE,
      allowNull: false,
      defaultValue: sequelize.literal(
        'CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP',
      ),
    },
  })

  return UserRole
}*/
