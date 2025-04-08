const { createSSAdmin } = require("../../../Controller/Developer/Admin/admin");
const express = require("express");

const router = express.Router();

router.post("/create-admin", createSSAdmin);

module.exports = router;

