const express = require("express");
const router = express.Router();

const userController = require("../controllers/user");

router.post("/", userController.createUser, userController.getScoreRate); // 유저 생성, 점수 채점 후 상위 몇퍼센트인지 조회

module.exports = router;
