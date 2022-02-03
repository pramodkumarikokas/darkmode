const express = require("express");
const router = express.Router();

const subtaskController = require("../controllers/subtask.controller");
const verifyBaseToken=require('../../middleware/basetoken');

let routes = app => {
router.post("/create-sub-task/:taskId", verifyBaseToken,subtaskController.createSubTask);
router.put("/update-sub-task/:subtaskId",verifyBaseToken, subtaskController.updateSubTask);
router.get("/get-all-sub-task", verifyBaseToken, subtaskController.getAllSubTask);
router.get("/get-task-sub-detils/:subtaskId",verifyBaseToken, subtaskController.geOneSubTask);
router.delete("/delete-sub-task/:subtaskId",verifyBaseToken, subtaskController.deleteSubTask);

//router.post("/get-filter", verifyBaseToken, taskController.getAllFilter);

return app.use("/", router);
};

module.exports = routes;