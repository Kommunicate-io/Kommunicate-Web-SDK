module.exports = function(sequelize, DataTypes) {
  return sequelize.define("auto_suggest", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'category'
    },
    name: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'name'
    },
    content: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'content'
    }
  }, {
    underscored: true,
    paranoid: true
  });
}