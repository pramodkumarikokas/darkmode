const express = require("express");
const router = express.Router();

const memberController = require("../controllers/member.controller");
const verifyBaseToken=require('../../middleware/basetoken');

let routes = app => {
router.post("/create-member/:taskId", verifyBaseToken,memberController.createMember);
router.get("/get-all-member/:userid", verifyBaseToken, memberController.getAllMember);
/*router.get("/get-task-sub-detils/:subtaskId",verifyBaseToken, subtaskController.geOneSubTask);
router.delete("/delete-sub-task/:subtaskId",verifyBaseToken, subtaskController.deleteSubTask);*/

//router.post("/get-filter", verifyBaseToken, taskController.getAllFilter);

return app.use("/", router);
};

module.exports = routes;