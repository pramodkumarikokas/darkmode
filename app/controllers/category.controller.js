const db = require("../models");
const Category = db.categories;

// Create and Save a new category
exports.create = (req, res) => {
  // Validate request
  if (!req.body.name) {
    res.status(400).send({ message: "category name can not be empty!" });
    return;
  }

  // Create a category
  const category = new Category({
    name: req.body.name,
    description: req.body.description,
    published: req.body.published ? req.body.published : false
  });

  // Save category in the database
  category
    .save(category)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while creating the Category."
      });
    });
};

// Retrieve all category from the database.
exports.findAll = (req, res) => {
  const name = req.query.name;
  var condition = title ? { name: { $regex: new RegExp(name), $options: "i" } } : {};

  Category.find(condition)
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving category."
      });
    });
};

// Find a single category with an id
exports.findOne = (req, res) => {
  const id = req.params.id;

  Category.findById(id)
    .then(data => {
      if (!data)
        res.status(404).send({ message: "Not found category with id " + id });
      else res.send(data);
    })
    .catch(err => {
      res
        .status(500)
        .send({ message: "Error retrieving category with id=" + id });
    });
};

// Update a category by the id in the request
exports.update = (req, res) => {
  if (!req.body) {
    return res.status(400).send({
      message: "Data to update can not be empty!"
    });
  }

  const id = req.params.id;

  Category.findByIdAndUpdate(id, req.body, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot update category with id=${id}. Maybe category was not found!`
        });
      } else res.send({ message: "category was updated successfully." });
    })
    .catch(err => {
      res.status(500).send({
        message: "Error updating category with id=" + id
      });
    });
};

// Delete a category with the specified id in the request
exports.delete = (req, res) => {
  const id = req.params.id;

  Category.findByIdAndRemove(id, { useFindAndModify: false })
    .then(data => {
      if (!data) {
        res.status(404).send({
          message: `Cannot delete Category with id=${id}. Maybe Category was not found!`
        });
      } else {
        res.send({
          message: "Category was deleted successfully!"
        });
      }
    })
    .catch(err => {
      res.status(500).send({
        message: "Could not delete category with id=" + id
      });
    });
};

// Delete all category from the database.
exports.deleteAll = (req, res) => {
  Category.deleteMany({})
    .then(data => {
      res.send({
        message: `${data.deletedCount} category were deleted successfully!`
      });
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while removing all category."
      });
    });
};

// Find all published category
exports.findAllPublished = (req, res) => {
  Category.find({ published: true })
    .then(data => {
      res.send(data);
    })
    .catch(err => {
      res.status(500).send({
        message:
          err.message || "Some error occurred while retrieving Category."
      });
    });
};
