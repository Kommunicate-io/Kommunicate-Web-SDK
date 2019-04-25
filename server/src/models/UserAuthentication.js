let UserAuthentication = function (sequelize, DataTypes) {
    return sequelize.define("authentication", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        userName: {
            type: DataTypes.STRING(50),
            allowNull: false,
            unique: true,
            field: 'user_name'
        },
        password: {
            type: DataTypes.STRING(200),
            allowNull: false,
            field: 'password'
        }
    },
        {
            underscored: true,
            paranoid: true,
            freezeTableName: true,
        });
}
module.exports = UserAuthentication
