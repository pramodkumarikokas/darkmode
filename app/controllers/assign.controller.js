const upload = require("../middleware/upload");
const Recent = require('../models/recent.model.js');
const Category = require('../models/category.model.js');
const Assign = require('../models/assign.model.js');

const createAssign = async (req, res) => {
//console.log("61f0dec971670423bc10fbfa === ",)

if(!req.body.taskId) {
        return res.status(400).send({
            message: "Tasks id can not be empty"
        })
}

if(!req.body.userId) {
        return res.status(400).send({
            message: "user id can not be empty"
        })
}
let subtaskId=req.body.userId || "";

     var recent = new Assign({
        userId:req.body.userId,
        taskId:req.body.taskId,
        subtaskId:subtaskId
    });
//console.log("recent  ",recent)
 await assign.save()
    .then(data => {
        res.send({"status":200,"message":"successfully","data":assign});
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the recents."
        });
    });




};

// Retrieve and return all tasks from the database.
const getAllAssign = (req, res) => {

Assign.find().then(subtask => {
        res.send({"status":200,"result":assign});
    }).catch(err => {
        res.status(500).send({
            "status":401,
            message: err.message || "Some error occurred while retrieving tasks."
        });
    });
};


const deleteAssign = (req, res) => {
Assign.updateOne({_id: req.params.assignId},{$set:{"isDeleteFavoriteStatus":false}}).then(task => {
/*Task.findByIdAndRemove(req.params.taskId)
    .then(task => {*/
        if(!task) {
            return res.status(404).send({
                message: "Assign not found with id " + req.params.assignId
            });
        }
        res.send({message: "Assign deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "Assign not found with id " + req.params.assignId
            });                
        }
        return res.status(500).send({
            message: "Could not delete Assign with id " + req.params.assignId
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
  createAssign: createAssign,
   getAllAssign: getAllAssign,
    deleteAssign: deleteAssign
};