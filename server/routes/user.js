const express = require("express");
const router = express.Router();
const userController = require("../controllers/user");

//create new user
router.post("/", userController.createUser);
//update user profile
router.put("/:userId", userController.updateProfile);

module.exports = router;