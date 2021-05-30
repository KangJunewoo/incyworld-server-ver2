const Sequelize = require("sequelize");

module.exports = class Result extends Sequelize.Model {
    static init(sequelize) {
        return super.init(
            {
                imageUrl: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                videoUrl: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                title: {
                    type: Sequelize.STRING,
                    allowNull: false,
                },
                guide: {
                    type: Sequelize.TEXT,
                    allowNull: false,
                },
            },
            {
                sequelize,
                timestamps: false,
                underscored: false,
                modelName: "Result",
                tableName: "Result",
                paranoid: false,
            },
        );
    }

    static associate(db) {
        db.Result.hasMany(db.User, {
            foreignKey: "resultId",
            sourceKey: "id",
        });
    }
};
