module.exports = app => {
  const category = require("../controllers/category.controller.js");
const verifyBaseToken=require('../../middleware/basetoken');
  var router = require("express").Router();

  // Create a new category
  router.post("/",verifyBaseToken, category.create);

  // Retrieve all category
  router.get("/",verifyBaseToken, category.findAll);

  // Retrieve all published category
  router.get("/published",verifyBaseToken, category.findAllPublished);

  // Retrieve a single category with id
  router.get("/:id",verifyBaseToken, category.findOne);

  // Update a category with id
  router.put("/:id",verifyBaseToken, category.update);

  // Delete a category with id
  router.delete("/:id",verifyBaseToken, category.delete);

  // Create a new category
  router.delete("/",verifyBaseToken, category.deleteAll);

    

  app.use("/category", router);


};
