'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Upload extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
    }
  }
  Upload.init({
    title: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Title cannot be left empty!'
        },
        notEmpty: {
          msg: 'Title cannot be left empty!'
        }
      }
    },
    content: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Content cannot be left empty!'
        },
        notEmpty: {
          msg: 'Content cannot be left empty!'
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
    code: {
      type: DataTypes.STRING
    },
    AccountId: {
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Upload',
  });
  return Upload;
};