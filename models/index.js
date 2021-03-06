const Sequelize = require("sequelize");
const env = process.env.DB;
const config = require("../config/config.json")[env];

const User = require("./user");
const Result = require("./result");

const db = {};
const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config,
);

db.sequelize = sequelize;
db.User = User;
db.Result = Result;

User.init(sequelize);
Result.init(sequelize);

// 이게 맞는건진 모르겠네!!
// User.associate(db);
Result.associate(db);

module.exports = db;
