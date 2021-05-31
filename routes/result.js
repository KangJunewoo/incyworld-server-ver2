const express = require("express");
const router = express.Router();

const resultController = require("../controllers/result");

router.get("/:levelNum", resultController.getResult); // 결과 단계별 정보 조회

module.exports = router;
