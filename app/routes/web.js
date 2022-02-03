const express = require("express");
const router = express.Router();

const uploadController = require("../controllers/upload");

let routes = app => {
  

  router.post("/multiple-upload", uploadController.multipleUpload);

  return app.use("/", router);
};

module.exports = routes;