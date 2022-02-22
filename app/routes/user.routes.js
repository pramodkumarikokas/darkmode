const express = require("express");
const router = express.Router();

const userController = require("../controllers/user.controller");
const verifyBaseToken=require('../../middleware/basetoken');



let routes = app => {
router.put("/update-user",verifyBaseToken, userController.updateUser);
router.get("/get-all-user", verifyBaseToken, userController.getAllUser);
router.get("/get-user-detils/:userId",verifyBaseToken, userController.geOneUser);
router.put("/delete-user/:userId",verifyBaseToken, userController.deleteUser);
return app.use("/", router);
};

module.exports = routes;