'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Account extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Account.belongsTo(models.User, { foreignKey: 'UserId' })
      Account.hasMany(models.Upload, { foreignKey: 'AccountId' })
    }
  }
  Account.init({
    username: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        notNull: {
          msg: 'Username cannot be left empty!'
        },
        notEmpty: {
          msg: 'Username cannot be left empty!'
        }
      }
    },
    imageUrl: {
      type: DataTypes.STRING,
      validate: {
        isUrl: {
          msg: 'Image URL should be in URL format'
        }
      }
    },
    UserId: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Account',
  });

  return Account;
};