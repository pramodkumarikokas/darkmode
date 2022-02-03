const upload = require("../middleware/upload");
const Recent = require('../models/recent.model.js');
const Category = require('../models/category.model.js');

const createRecent = async (req, res) => {
console.log("61f0dec971670423bc10fbfa === ",)

if(!req.params.taskId) {
        return res.status(400).send({
            message: "Tasks name can not be empty"
        })
}

     var recent = new Recent({
        taskId:req.params.taskId
    });
console.log("recent  ",recent)
 await recent.save()
    .then(data => {
        res.send({"status":200,"message":"successfully","data":recent});
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the recents."
        });
    });




};

// Retrieve and return all tasks from the database.
const getAllRecent = (req, res) => {

Recent.find().then(subtask => {
        res.send(subtask);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving tasks."
        });
    });
};
/*
// Find a single Task with a TaskId
const geOneSubTask = (req, res) => {
Subtask.findById(req.params.subtaskId)
    .then(subtask => {
        if(!subtask) {
            return res.status(404).send({
                message: "task not found with id " + req.params.subtaskId
            });            
        }
        res.send(subtask);
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "task not found with id " + req.params.subtaskId
            });                
        }
        return res.status(500).send({
            message: "Error retrieving task with id " + req.params.subtaskId
        });
    });
};*/

// Delete a task with the specified taskId in the request
/*const deleteSubTask = (req, res) => {

Subtask.findByIdAndRemove(req.params.subtaskId)
    .then(subtask => {
        if(!subtask) {
            return res.status(404).send({
                message: "task not found with id " + req.params.subtaskId
            });
        }
        res.send({message: "task deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "task not found with id " + req.params.subtaskId
            });                
        }
        return res.status(500).send({
            message: "Could not delete task with id " + req.params.subtaskId
        });
    });
    
};*/



module.exports = {
  createRecent: createRecent,
   getAllRecent: getAllRecent,
};