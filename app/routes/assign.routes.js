const express = require("express");
const router = express.Router();

const assignController = require("../controllers/assign.controller");
const verifyBaseToken=require('../../middleware/basetoken');

let routes = app => {
router.post("/create-assign", verifyBaseToken,assignController.createAssign);
router.get("/get-all-assign/:assignId", verifyBaseToken, assignController.getAllAssign);
router.put("/delete/:assignId", verifyBaseToken, assignController.deleteAssign);
/*router.get("/get-task-sub-detils/:subtaskId",verifyBaseToken, subtaskController.geOneSubTask);
router.delete("/delete-sub-task/:subtaskId",verifyBaseToken, subtaskController.deleteSubTask);*/

//router.post("/get-filter", verifyBaseToken, taskController.getAllFilter);

return app.use("/", router);
};

module.exports = routes;