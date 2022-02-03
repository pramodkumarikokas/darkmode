const express = require("express");
const router = express.Router();

const favoriteController = require("../controllers/favorite.controller");
const verifyBaseToken=require('../../middleware/basetoken');

let routes = app => {
router.post("/create-favorite/:taskId", verifyBaseToken,favoriteController.createFavorite);
router.get("/get-all-favorite/:userid", verifyBaseToken, favoriteController.getAllFavorite);
/*router.get("/get-task-sub-detils/:subtaskId",verifyBaseToken, subtaskController.geOneSubTask);
router.delete("/delete-sub-task/:subtaskId",verifyBaseToken, subtaskController.deleteSubTask);*/

//router.post("/get-filter", verifyBaseToken, taskController.getAllFilter);

return app.use("/", router);
};

module.exports = routes;