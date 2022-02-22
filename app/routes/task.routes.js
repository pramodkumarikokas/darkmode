const express = require("express");
const router = express.Router();

const taskController = require("../controllers/task.controller");
const verifyBaseToken=require('../../middleware/basetoken');

let routes = app => {
router.post("/create-task", verifyBaseToken,taskController.createTask);
router.put("/update-task/:taskId",verifyBaseToken, taskController.updateTask);
router.get("/get-all-task", verifyBaseToken, taskController.getAllTask);

router.get("/get-task-detils/:taskId",verifyBaseToken, taskController.geOneTask);
router.put("/delete-task/:taskId",verifyBaseToken, taskController.deleteTask);
router.post("/get-status-task", verifyBaseToken, taskController.getStatusTask);
router.get("/privacypolicy", taskController.privacypolicy);

router.post("/search", verifyBaseToken, taskController.getAllFilter);

return app.use("/", router);
};

module.exports = routes;