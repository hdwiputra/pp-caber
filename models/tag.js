'use strict';
const {
  Model
} = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Tag extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tag.belongsToMany(models.Upload, { through: models.UploadsTag })

    }
  }
  Tag.init({
    tagName: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        notNull: {
          msg: 'Tag cannot be left empty!'
        },
        notEmpty: {
          msg: 'Tag cannot be left empty!'
        }
      }
    }
  }, {
    sequelize,
    modelName: 'Tag',
  });
  return Tag;
};