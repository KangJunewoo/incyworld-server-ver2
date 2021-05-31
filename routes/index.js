const express = require("express");
const router = express.Router();

router.use("/user", require("./user"));
router.use("/result", require("./result"));

module.exports = router;
