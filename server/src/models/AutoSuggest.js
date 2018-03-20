module.exports = function(sequelize, DataTypes) {
  return sequelize.define("auto_suggest", {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
      allowNull: false
    },
    applicationId: {
      type: DataTypes.STRING(200),
      allowNull: false,
      field: 'application_id'
    },
    userName: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'user_name'
    },
    category: {
      type: DataTypes.STRING(50),
      allowNull: false,
      field: 'category'
    },
    name: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'name'
    },
    content: {
      type: DataTypes.TEXT,
      allowNull: false,
      field: 'content'
    },
    type: {
     type:DataTypes.ENUM,
     values: ['faq', 'shortcut']
    },
    status: {
     type:DataTypes.ENUM,
     values: ['draft', 'published']
    }
  }, {
    underscored: true,
    paranoid: true
  });
}