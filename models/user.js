const Sequelize = require("sequelize");

module.exports = class User extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                birthYear: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
                score: {
                    type: Sequelize.INTEGER,
                    allowNull: true,
                },
            },
            {
                sequelize,
                timestamps: true,
                underscored: false,
                modelName: "User",
                tableName: "User",
                paranoid: true,
            },
        );
    }

    // static associate(db) {
    //     db.User.belongsTo(db.Result);
    // }
};
