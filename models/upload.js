'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Upload extends Model {
    static associate(models) {
      // define association here
      Upload.belongsTo(models.Account, { foreignKey: 'AccountId' });
      Upload.belongsToMany(models.Tag, { through: models.UploadsTag })
    }

    get formattedContent() {
      return this.content?.replace(/\n/g, '<br>') || '';
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
      type: DataTypes.INTEGER,
      validate: {
        isUrl: {
          msg: 'Image URL should be in URL format'
        }
      }
    },
    AccountId: {
      type: DataTypes.INTEGER
    },
    code:{
      type: DataTypes.STRING
    }
  }, {
    sequelize,
    modelName: 'Upload',
  });
  return Upload;
};