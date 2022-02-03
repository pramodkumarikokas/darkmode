const express = require("express");
const router = express.Router();

const recentController = require("../controllers/recent.controller");
const verifyBaseToken=require('../../middleware/basetoken');

let routes = app => {
router.post("/create-recent/:taskId", verifyBaseToken,recentController.createRecent);
router.get("/get-all-recent", verifyBaseToken, recentController.getAllRecent);
/*router.get("/get-task-sub-detils/:subtaskId",verifyBaseToken, subtaskController.geOneSubTask);
router.delete("/delete-sub-task/:subtaskId",verifyBaseToken, subtaskController.deleteSubTask);*/

//router.post("/get-filter", verifyBaseToken, taskController.getAllFilter);

return app.use("/", router);
};

module.exports = routes;