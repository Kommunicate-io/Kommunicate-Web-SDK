let Feedback = function (sequelize, DataTypes) {
    return sequelize.define("Feedback", {
        groupId: {
            type: DataTypes.INTEGER,
            primaryKey: true,
            allowNull: false,
            field: 'group_id'
        },
        comments: {
            type: DataTypes.JSON,
            allowNull: true,
            field: 'comments'
        },
        rating: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "rating"
        },
        type: {
            type: DataTypes.INTEGER,
            allowNull: true,
            field: "type"
        }
    },
        {
            freezeTableName: true,
            underscored: true,
            paranoid: true
        });
}
module.exports = Feedback

