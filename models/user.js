  'use strict';
  const bcrypt = require('bcryptjs');

  const {
    Model
  } = require('sequelize');
  module.exports = (sequelize, DataTypes) => {
    class User extends Model {
      /**
       * Helper method for defining associations.
       * This method is not a part of Sequelize lifecycle.
       * The `models/index` file will call this method automatically.
       */
      static associate(models) {
        // define association here
        User.hasOne(models.Account, { foreignKey: 'UserId' })
      }
    }
    User.init({
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
          notNull: {
            msg: 'Email is needed to register!'
          },
          notEmpty: {
            msg: 'Email is needed to register!'
          },
          isEmail: {
            msg: 'Email must be in email format!'
          }
        }
      },
      password: {
        type: DataTypes.STRING,
        allowNull: false,
        validate: {
          notNull: {
            msg: 'Password is needed to register!'
          },
          notEmpty: {
            msg: 'Password is needed to register!'
          },
          is: {
            args: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{5,}$/,
            msg: 'Password must be at least 5 characters, Password must include uppercase, Password must include lowercase, Password must include a number, Password must include a symbol.'
          }
          // passRequirement(value) {
          //   const errors = [];
          //   const minLength = 5;

          //   if (value.length) {
          //     if (value.length < minLength) {
          //       errors.push('Password must be at least 5 characters long.');
          //     }
          //     if (!/[A-Z]/.test(value)) {
          //       errors.push('Password must include an uppercase letter.');
          //     }
          //     if (!/[a-z]/.test(value)) {
          //       errors.push('Password must include a lowercase letter.');
          //     }
          //     if (!/[^A-Za-z0-9]/.test(value)) {
          //       errors.push('Password must include a symbol.');
          //     }
          //   }
          //   if (errors.length) {
          //     throw new Error(errors.join(','));
          //   }
          // }
        }
      },
      role: {
        type: DataTypes.STRING
      }
    }, {
      sequelize,
      modelName: 'User',
    });

    User.beforeCreate((user) => {
      const salt = bcrypt.genSaltSync(10);
      const hash = bcrypt.hashSync(user.password, salt);
      user.password = hash;
    })
    return User;
  };