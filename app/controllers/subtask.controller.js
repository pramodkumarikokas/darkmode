const upload = require("../middleware/upload");
const Subtask = require('../models/subtask.model.js');
const Category = require('../models/category.model.js');

const createSubTask = async (req, res) => {


if(!req.params.taskId) {
        return res.status(400).send({
            message: "Tasks name can not be empty"
        });
    }
     if(!req.body.sub_name) {
        return res.status(400).send({
            message: "Tasks name can not be empty"
        });
    }
    if(!req.body.sub_assignDate) {
        return res.status(400).send({
            message: "sub_assignDate name can not be empty"
        });
    }



     var subtask = new Subtask({
        assignId:req.params.taskId,
        sub_notes: req.body.sub_notes || "", 
        sub_name: req.body.sub_name || "", 
        sub_assignDate:req.body.sub_assignDate
    });

 await subtask.save()
    .then(data => {
        res.send({"status":200,"message":"successfully","data":subtask});
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while creating the Sub tasks."
        });
    });


};


// Update a note identified by the noteId in the request
const updateSubTask = async (req, res) => {



if(!req.params.subtaskId) {
        return res.status(400).send({
            message: "subtaskId name can not be empty"
        });
    }
var sub_taskobj={};
 if(req.body.sub_notes) {
       sub_taskobj.sub_notes= req.body.sub_notes;
    }
  
    if(req.body.sub_name) {
       sub_taskobj.sub_name= req.body.sub_name;
    }
    if(!req.body.sub_assignDate) {
        sub_taskobj.sub_assignDate=req.body.sub_assignDate;
    }
    
 
     
    Subtask.updateOne({_id: req.params.subtaskId},{$set:sub_taskobj}).then(subtask => {
        //console.log("nnn ",note)
        if(!subtask) {
            return res.status(404).send({
                message: "Task not found with id " + req.params.subtaskId
            });
        }
        res.send(
            {
                "status":200,
                "message":"updated successfully",
                "data":sub_taskobj
           }
    );
    }).catch(err => {
        if(err.kind === 'ObjectId') {
            return res.status(404).send({
                message: "Task not found with id " + req.params.subtaskId
            });                
        }
        return res.status(500).send({
            message: "Error updating note with id " + req.params.subtaskId
        });
    });


};


// Retrieve and return all tasks from the database.
const getAllSubTask = (req, res) => {

Subtask.find().then(subtask => {
        res.send(subtask);
    }).catch(err => {
        res.status(500).send({
            message: err.message || "Some error occurred while retrieving tasks."
        });
    });
};

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
};

// Delete a task with the specified taskId in the request
const deleteSubTask = (req, res) => {

Subtask.updateOne({_id: req.params.subtaskId},{$set:{"isDeleteSubtaskStatus":false}}).then(task => {
/*Task.findByIdAndRemove(req.params.taskId)
    .then(task => {*/
        if(!task) {
            return res.status(404).send({
                message: "task not found with id " + req.params.taskId
            });
        }
        res.send({message: "subtask deleted successfully!"});
    }).catch(err => {
        if(err.kind === 'ObjectId' || err.name === 'NotFound') {
            return res.status(404).send({
                message: "task not found with id " + req.params.taskId
            });                
        }
        return res.status(500).send({
            message: "Could not delete task with id " + req.params.taskId
        });
    });
    
};



module.exports = {
  createSubTask: createSubTask,
   updateSubTask: updateSubTask,
   getAllSubTask: getAllSubTask,
   geOneSubTask: geOneSubTask,
    deleteSubTask: deleteSubTask
};