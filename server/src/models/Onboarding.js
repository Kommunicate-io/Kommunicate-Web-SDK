let Onboarding = function (sequelize, DataTypes) {
    return sequelize.define("onboarding", {
        id: {
            type: DataTypes.INTEGER,
            autoIncrement: true,
            primaryKey: true,
            allowNull: false
        },
        applicationId: {
            type: DataTypes.STRING(150),
            allowNull: false,
            field: 'application_id'
        },
        stepId: {
            type: DataTypes.INTEGER,
            field: "step_id",
            defaultValue: null
        },
        completed: {
            type: DataTypes.BOOLEAN,
            field: "completed",
            defaultValue: null
        }
    },
        {
            underscored: true,
            paranoid: true,
            freezeTableName: true,
        });
}
module.exports = Onboarding
